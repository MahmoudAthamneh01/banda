'use client';

import { useEffect } from 'react';

import { normalizeLocale, type UiLocale } from './ui-copy';
import { translateRuntimeText } from './runtime-copy';

interface RuntimeLocalizerProps {
  locale: string;
}

const SKIP_SELECTOR = 'script, style, code, pre, textarea, [data-no-localize]';
const ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'] as const;

function translateNodeText(locale: UiLocale, value: string) {
  const leading = value.match(/^\s*/)?.[0] ?? '';
  const trailing = value.match(/\s*$/)?.[0] ?? '';
  const body = value.trim();
  const translated = translateRuntimeText(locale, body);

  return translated ? `${leading}${translated}${trailing}` : value;
}

function shouldTranslateValue(value: string) {
  return /[A-Za-z]/.test(value) && value.trim().length > 1;
}

function translateElementAttributes(locale: UiLocale, element: Element) {
  ATTRIBUTES.forEach((attribute) => {
    const value = element.getAttribute(attribute);
    if (!value || !shouldTranslateValue(value)) return;

    const translated = translateRuntimeText(locale, value);
    if (translated && translated !== value) {
      element.setAttribute(attribute, translated);
    }
  });

  if (element instanceof HTMLInputElement) {
    const type = element.type.toLowerCase();
    const canTranslateValue = ['button', 'submit', 'reset'].includes(type);
    if (canTranslateValue && shouldTranslateValue(element.value)) {
      const translated = translateRuntimeText(locale, element.value);
      if (translated && translated !== element.value) {
        element.value = translated;
      }
    }
  }
}

function localizeTree(locale: UiLocale) {
  if (locale === 'en' || typeof document === 'undefined') return;

  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
        if (!shouldTranslateValue(node.nodeValue ?? '')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => {
    const current = node.nodeValue ?? '';
    const translated = translateNodeText(locale, current);
    if (translated !== current) {
      node.nodeValue = translated;
    }
  });

  document.body.querySelectorAll('*').forEach((element) => {
    if (!element.closest(SKIP_SELECTOR)) {
      translateElementAttributes(locale, element);
    }
  });
}

export function RuntimeLocalizer({ locale }: RuntimeLocalizerProps) {
  useEffect(() => {
    const normalizedLocale = normalizeLocale(locale);
    if (normalizedLocale === 'en') return undefined;

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        localizeTree(normalizedLocale);
      });
    };

    schedule();

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATTRIBUTES, 'value'],
    });

    return () => {
      observer.disconnect();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [locale]);

  return null;
}
