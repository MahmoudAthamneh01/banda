import { Request, Response } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/db';
import { verifyToken } from '../../lib/jwt';

const ChatSchema = z.object({
    agentId: z.string().min(1).default('host-panda'),
    message: z.string().min(1).max(8000),
    conversationId: z.string().uuid().optional(),
    locale: z.string().min(2).max(10).default('en'),
    surface: z.string().max(80).optional(),
    context: z.record(z.unknown()).optional(),
});

type AIReply = {
    provider: string;
    model: string;
    content: string;
};

function getUserIdFromRequest(req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    return verifyToken(authHeader.split(' ')[1])?.userId ?? null;
}

function getAgentSystemPrompt(agentId: string, locale: string) {
    const localeInstruction = locale.startsWith('ar')
        ? 'Respond in Arabic unless the user asks otherwise.'
        : locale.startsWith('zh')
          ? 'Respond in Chinese unless the user asks otherwise.'
          : 'Respond in English unless the user asks otherwise.';

    const roles: Record<string, string> = {
        'host-panda': 'You are Host Panda, a concise onboarding guide for BandaChao.',
        'deal-cat': 'You are Deal Cat, a sourcing and deal-comparison assistant.',
        'hungry-hippo': 'You are Hungry Hippo, an order, wallet, and checkout operations assistant.',
        'guard-dog': 'You are a risk and compliance assistant for marketplace operations.',
        'wise-owl': 'You are Wise Owl, an analytics and marketplace metrics assistant.',
        'spark-dragon': 'You are Spark Dragon, a maker enablement and production workflow assistant.',
    };

    return [
        roles[agentId] || roles['host-panda'],
        localeInstruction,
        'Keep answers practical and short. Do not invent order, wallet, or user data you cannot see.',
    ].join(' ');
}

function localAgentReply(agentId: string, message: string, locale: string) {
    const summaries: Record<string, string> = {
        'host-panda': 'I can help you choose the right next step in BandaChao.',
        'deal-cat': 'I can compare products, bundles, and price signals.',
        'hungry-hippo': 'I can check order state, payment flow, and post-checkout actions.',
        'guard-dog': 'I can flag risk, fraud, and compliance issues.',
        'wise-owl': 'I can explain marketplace metrics and operational decisions.',
        'spark-dragon': 'I can help makers improve listings and production workflows.',
    };

    const intro = summaries[agentId] || summaries['host-panda'];
    const trimmed = message.trim().slice(0, 240);

    if (locale.startsWith('ar')) {
        return `${intro} طلبك: "${trimmed}". هذا رد محلي تجريبي؛ اربط OPENAI_API_KEY أو مزود AI لاحقًا لتفعيل ردود حقيقية.`;
    }

    return `${intro} Your request: "${trimmed}". This is the local demo AI provider; wire OPENAI_API_KEY or another provider when you are ready for live responses.`;
}

async function deepSeekReply(input: z.infer<typeof ChatSchema>): Promise<AIReply | null> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        return null;
    }

    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
    const baseUrl = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: getAgentSystemPrompt(input.agentId, input.locale) },
                { role: 'user', content: input.message },
            ],
            temperature: 0.4,
            max_tokens: 900,
        }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        console.error('DeepSeek chat error:', data);
        throw new Error(data.error?.message || `DeepSeek request failed with ${response.status}`);
    }

    return {
        provider: 'deepseek',
        model,
        content: data.choices?.[0]?.message?.content || '',
    };
}

async function buildAIReply(input: z.infer<typeof ChatSchema>): Promise<AIReply> {
    if ((process.env.AI_PROVIDER || 'local').toLowerCase() === 'deepseek') {
        const reply = await deepSeekReply(input);
        if (reply) {
            return reply;
        }
    }

    return {
        provider: 'local',
        model: 'banda-local-demo',
        content: localAgentReply(input.agentId, input.message, input.locale),
    };
}

export const chat = async (req: Request, res: Response) => {
    try {
        const input = ChatSchema.parse(req.body);
        const userId = getUserIdFromRequest(req);
        const reply = await buildAIReply(input);

        if (!userId) {
            return res.json({
                provider: reply.provider,
                model: reply.model,
                conversationId: input.conversationId ?? null,
                message: {
                    role: 'assistant',
                    content: reply.content,
                },
            });
        }

        const conversation = input.conversationId
            ? await prisma.aIConversation.findFirst({
                  where: {
                      id: input.conversationId,
                      userId,
                  },
              })
            : await prisma.aIConversation.create({
                  data: {
                      userId,
                      provider: reply.provider,
                      model: reply.model,
                      title: input.message.slice(0, 80),
                      metadata: {
                          agentId: input.agentId,
                          locale: input.locale,
                          surface: input.surface,
                          context: input.context,
                      } as Prisma.InputJsonObject,
                  },
              });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found', code: 'AI_CONVERSATION_NOT_FOUND' });
        }

        await prisma.aIMessage.createMany({
            data: [
                {
                    conversationId: conversation.id,
                    role: 'user',
                    content: input.message,
                },
                {
                    conversationId: conversation.id,
                    role: 'assistant',
                    content: reply.content,
                },
            ],
        });

        res.json({
            provider: reply.provider,
            model: reply.model,
            conversationId: conversation.id,
            message: {
                role: 'assistant',
                content: reply.content,
            },
        });
    } catch (error) {
        console.error('AI chat error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const listConversations = async (req: Request, res: Response) => {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized', code: 'AUTH_REQUIRED' });
        }

        const conversations = await prisma.aIConversation.findMany({
            where: { userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    take: 50,
                },
            },
            orderBy: { updatedAt: 'desc' },
            take: 50,
        });

        res.json({ conversations });
    } catch (error) {
        console.error('AI conversations error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};
