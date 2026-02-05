"use client";

/**
 * 🐦 CHATTY_BIRD - The Social Messenger
 * Delivers platform pulse: trends, market activity, quick signals
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Zap, Users, ArrowRight } from 'lucide-react';
import { getCharacter } from '@/lib/ai/registry';
import { aiEventBus } from '@/lib/ai/event-bus';
import { CharacterTicker, CharacterBubble, useCharacterUI } from './CharacterBase';

const character = getCharacter('CHATTY_BIRD');

interface ChattyBirdProps {
  locale: string;
}

interface NewsItem {
  id: string;
  text: string;
  type: 'trending' | 'flash' | 'social' | 'tip';
  route?: string;
}

export function ChattyBird({ locale }: ChattyBirdProps) {
  const router = useRouter();
  const { state, show, hide, mute } = useCharacterUI('CHATTY_BIRD');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState('');

  // Listen for relevant events
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    // First visit greeting
    unsubscribes.push(
      aiEventBus.on('USER_FIRST_VISIT', () => {
        setBubbleMessage('Welcome to BandaChao! 🎉 Check out what\'s trending today.');
        setShowBubble(true);
        setTimeout(() => show(), 3000);
      })
    );

    // Flash drop alert
    unsubscribes.push(
      aiEventBus.on('FLASH_DROP_STARTED', (event) => {
        const count = (event.payload.productCount as number) || 0;
        setNewsItems(items => [{
          id: `flash-${Date.now()}`,
          text: `⚡ Flash Drop just started! ${count} new items available`,
          type: 'flash',
          route: `/${locale}/flash-drops`,
        }, ...items.slice(0, 4)]);
        show();
      })
    );

    // Trending product
    unsubscribes.push(
      aiEventBus.on('TRENDING_PRODUCT', (event) => {
        const productId = event.payload.productId as string;
        const interactions = event.payload.interactionCount as number;
        setNewsItems(items => [{
          id: `trend-${productId}`,
          text: `🔥 A product just hit ${interactions}+ likes today!`,
          type: 'trending',
          route: `/${locale}/products/${productId}`,
        }, ...items.slice(0, 4)]);
        show();
      })
    );

    // Tab changes
    unsubscribes.push(
      aiEventBus.on('TAB_CHANGED', () => {
        // Occasionally show tip on tab change
        if (Math.random() > 0.8) {
          const tips = [
            'Check out the Square for community drops!',
            'Flash Drops refresh every hour 👀',
            'Follow your favorite makers for updates',
          ];
          setBubbleMessage(tips[Math.floor(Math.random() * tips.length)]);
          setShowBubble(true);
        }
      })
    );

    return () => unsubscribes.forEach(unsub => unsub());
  }, [locale, show]);

  // Generate mock news on mount (in production, this would come from API)
  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        id: '1',
        text: '🔥 Handcrafted ceramics are trending this week',
        type: 'trending',
        route: `/${locale}/categories/ceramics`,
      },
      {
        id: '2',
        text: '⚡ 3 new Flash Drops in the last hour',
        type: 'flash',
        route: `/${locale}/flash-drops`,
      },
      {
        id: '3',
        text: '👥 42 makers joined today from your region',
        type: 'social',
        route: `/${locale}/makers`,
      },
    ];
    setNewsItems(mockNews);
  }, [locale]);

  const handleItemClick = (item: NewsItem) => {
    if (item.route) {
      router.push(item.route);
      hide();
    }
  };

  return (
    <>
      {/* Ticker for continuous updates */}
      <CharacterTicker
        character={character}
        items={newsItems.map(item => ({
          id: item.id,
          text: item.text,
          onClick: () => handleItemClick(item),
        }))}
        visible={state.visible && !state.muted}
        onMute={() => mute()}
      />

      {/* Bubble for specific messages */}
      {showBubble && !state.muted && (
        <CharacterBubble
          character={character}
          message={bubbleMessage}
          onDismiss={() => setShowBubble(false)}
          onAction={() => router.push(`/${locale}/flash-drops`)}
          actionLabel="See What's Hot"
          autoHide={6000}
        />
      )}
    </>
  );
}

// Standalone ticker widget for embedding
export function ChattyBirdTicker({ locale }: { locale: string }) {
  const router = useRouter();

  const trendingItems = [
    { icon: TrendingUp, text: 'Ceramics +23% this week', route: `/${locale}/categories/ceramics` },
    { icon: Zap, text: '5 Flash Drops ending soon', route: `/${locale}/flash-drops` },
    { icon: Users, text: '156 new makers this month', route: `/${locale}/makers` },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % trendingItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [trendingItems.length]);

  const current = trendingItems[currentIndex];
  const Icon = current.icon;

  return (
    <button
      onClick={() => router.push(current.route)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-all group"
    >
      <span className="text-lg">{character.emoji}</span>
      <Icon className="w-4 h-4 text-sky-400" />
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
        {current.text}
      </span>
      <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-sky-400 transition-colors" />
    </button>
  );
}
