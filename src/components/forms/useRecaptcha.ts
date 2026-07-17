'use client';

import { useCallback, useEffect } from 'react';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Loads the reCAPTCHA v3 script (once) and returns an execute() function that
 * yields a token. If no site key is configured, execute() resolves to '' so the
 * form still works in development (server verification then fails open).
 */
export function useRecaptcha(siteKey: string) {
  useEffect(() => {
    if (!siteKey) return;
    const id = 'recaptcha-v3';
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id;
    s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    s.async = true;
    document.head.appendChild(s);
  }, [siteKey]);

  return useCallback(
    async (action: string): Promise<string> => {
      if (!siteKey || !window.grecaptcha) return '';
      return new Promise<string>((resolve) => {
        window.grecaptcha!.ready(() => {
          window.grecaptcha!.execute(siteKey, { action }).then(resolve).catch(() => resolve(''));
        });
      });
    },
    [siteKey],
  );
}
