import { NextRequest, NextResponse } from 'next/server';

type AgentChatRequest = {
  agentId?: string;
  message?: string;
  history?: Array<{ role?: string; content?: string }>;
};

const agentNames: Record<string, string> = {
  'deal-cat': 'Deal Cat',
  'cyber-wukong': 'Cyber Wukong',
  'magistrate-mandrill': 'Magistrate Mandrill',
  'style-guru': 'Style Guru',
  'trust-mother': 'Trust Mother',
  'hungry-panda': 'Hungry Panda',
  'chatty-bird': 'Chatty Bird',
  'host-panda': 'Host Panda',
};

function buildMockReply(agentId: string, message: string): string {
  const agentName = agentNames[agentId] || 'BandaChao Assistant';
  const normalized = message.trim();

  if (agentId === 'deal-cat') {
    return `${agentName}: I can help compare the deal, estimate bulk savings, and suggest a safe next step for "${normalized}".`;
  }

  if (agentId === 'cyber-wukong') {
    return `${agentName}: I will check operational risk, stock pressure, and suspicious signals around "${normalized}".`;
  }

  if (agentId === 'magistrate-mandrill') {
    return `${agentName}: I can summarize the dispute facts, separate evidence from claims, and prepare a neutral recommendation.`;
  }

  if (agentId === 'host-panda') {
    return `${agentName}: I can guide you through the next setup step and explain what is required before you continue.`;
  }

  return `${agentName}: I received your message: "${normalized}". Backend AI is not configured yet, so this is the local safe fallback.`;
}

function getBackendApiUrl() {
  return (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
}

export async function POST(request: NextRequest) {
  let body: AgentChatRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'VALIDATION_FAILED', message: 'Invalid JSON body' } },
      { status: 400 }
    );
  }

  const agentId = body.agentId || 'chatty-bird';
  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_FAILED', message: 'Message is required' } },
      { status: 400 }
    );
  }

  const backendApiUrl = getBackendApiUrl();
  if (backendApiUrl) {
    try {
      const response = await fetch(`${backendApiUrl}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(request.headers.get('authorization')
            ? { Authorization: request.headers.get('authorization') as string }
            : {}),
        },
        body: JSON.stringify({
          agentId,
          message,
          locale: request.nextUrl.pathname.split('/')[1] || 'en',
          surface: 'agent-renderer',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          message: data.message?.content || buildMockReply(agentId, message),
          agentId,
          source: data.provider || 'backend',
          model: data.model,
          conversationId: data.conversationId,
          historyLength: body.history?.length || 0,
        });
      }
    } catch (error) {
      console.error('Agent backend proxy failed:', error);
    }
  }

  return NextResponse.json({
    message: buildMockReply(agentId, message),
    agentId,
    source: 'local-fallback',
    historyLength: body.history?.length || 0,
  });
}
