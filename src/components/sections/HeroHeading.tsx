'use client';

import { useEffect, useRef, useState } from 'react';

/** Longest run of whole words every phrase opens with — "AI That " here. */
function sharedStem(phrases: string[]): string {
  if (phrases.length < 2) return '';
  let end = 0;
  const first = phrases[0];
  for (let i = 0; i < first.length; i += 1) {
    if (phrases.some((p) => p[i] !== first[i])) break;
    end = i + 1;
  }
  // back off to a word boundary so a shared run never splits mid-word
  const cut = first.slice(0, end).lastIndexOf(' ');
  return cut < 0 ? '' : first.slice(0, cut + 1);
}

const TYPE_MS = 85;
const DELETE_MS = 45;
const HOLD_MS = 3000;

/**
 * The hero headline, with only the final word typed.
 *
 * Holding the rest of the heading still takes more than not re-rendering it.
 * The typed word changes width on every keystroke, so on a centred heading the
 * line re-centres and `text-wrap: balance` re-wraps the block — which shuffles
 * the static copy even though React never touches it. Two things pin it:
 *
 *   1. The lead sits in its own block, so it can never share a line with the
 *      phrase and never rewraps when the phrase changes length.
 * The phrase line itself is left to centre naturally. Reserving the width of
 * the longest alternative did hold "AI That" to one position, but the reserved
 * slack sat entirely to the right of a shorter word and the line centred around
 * that gap — so the whole phrase read as pushed to the left. A little drift
 * while typing is the lesser fault; the line always looks centred, and the lead
 * above it is pinned by its own block either way.
 *
 * The gradient wraps the stem and the slot together as one element, so the
 * sweep runs continuously across the whole phrase. Painting the two separately
 * would restart the gradient mid-phrase and show a seam.
 *
 * The typed word is `aria-hidden` and paired with a visually hidden copy of the
 * first word, so the heading keeps one stable accessible name instead of
 * announcing a new one every few keystrokes. The full first phrase renders on
 * the server, so the heading reads correctly before JavaScript runs.
 */
export function HeroHeading({
  prefix,
  suffix,
  phrases,
  className,
  style,
}: {
  prefix: string;
  suffix: string;
  phrases: string[];
  className?: string;
  style?: React.CSSProperties;
}) {
  const stem = sharedStem(phrases);
  const tails = phrases.map((p) => p.slice(stem.length));

  const [typed, setTyped] = useState(tails[0]);
  const [on, setOn] = useState(false);
  const state = useRef({ i: 0, len: tails[0].length, deleting: false });

  useEffect(() => {
    if (tails.length < 2) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    setOn(true);

    let timer = 0;
    const step = () => {
      const s = state.current;
      const full = tails[s.i];
      let wait: number;

      if (!s.deleting) {
        s.len += 1;
        if (s.len >= full.length) {
          s.len = full.length;
          s.deleting = true;
          wait = HOLD_MS;
        } else {
          wait = TYPE_MS;
        }
      } else {
        s.len -= 1;
        if (s.len <= 0) {
          s.len = 0;
          s.deleting = false;
          s.i = (s.i + 1) % tails.length;
          wait = TYPE_MS;
        } else {
          wait = DELETE_MS;
        }
      }

      setTyped(tails[s.i].slice(0, s.len));
      timer = window.setTimeout(step, wait);
    };

    timer = window.setTimeout(step, HOLD_MS);
    return () => window.clearTimeout(timer);
    // tails is derived from props and stable for the life of the section
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases.join(' ')]);

  return (
    <h1 className={className} style={style}>
      {/* trailing space keeps the two blocks from running together as one word
          for anything reading the text rather than the layout */}
      <span className="hr-lead">{prefix.trim()}{' '}</span>
      <span className="hr-line">
        <span className="hm">
          {stem}
          <span aria-hidden={on}>
            {typed}
            {on && <span className="hr-caret" />}
          </span>
        </span>
        {/* Only the typed word is replaced, not the whole phrase — the stem
            beside it is still announced, so repeating it here would make the
            heading read "AI That AI That Delivers". */}
        {on && <span className="sr-only">{tails[0]}</span>}
        {suffix}
      </span>
    </h1>
  );
}
