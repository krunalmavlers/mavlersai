'use client';

import { useEffect, useRef } from 'react';

/**
 * Animated hero background — a hub with orbiting system nodes and pulsing
 * connection dots. Constrained to a compact box on the right side of the hero
 * (beside the copy) so it never bleeds across the whole section. Hidden on
 * small screens and when the user prefers reduced motion.
 */
export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = ['CRM', 'ERP', 'Website', 'Email', 'Analytics', 'Support', 'Docs', 'API'];
    const phases = labels.map((_, i) => (i * 1.7) % (Math.PI * 2));
    let W = 0;
    let H = 0;
    let raf = 0;
    let t = 0;
    let nodes: { x: number; y: number; label: string; phase: number }[] = [];
    let hub = { x: 0, y: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      if (W === 0 || H === 0) return; // hidden (e.g. mobile) — nothing to draw
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cx = W * 0.5;
      const cy = H * 0.46;
      // Keep the whole constellation inside the box: the node ring reaches up
      // to ~1.14×R, so cap R against both axes with margin.
      const R = Math.min(W * 0.36, H * 0.34);
      nodes = labels.map((l, i) => {
        const a = (i / labels.length) * Math.PI * 2 - Math.PI / 2;
        return {
          x: cx + Math.cos(a) * R * (0.9 + (i % 3) * 0.1),
          y: cy + Math.sin(a) * R * (0.9 + (i % 3) * 0.1),
          label: l,
          phase: phases[i],
        };
      });
      hub = { x: cx, y: cy };
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t += 0.012;
      if (W === 0 || H === 0) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(hub.x, hub.y);
        ctx.strokeStyle = 'rgba(255,203,46,0.16)';
        ctx.lineWidth = 1;
        ctx.stroke();
        const p = (Math.sin(t + n.phase) + 1) / 2;
        const px = n.x + (hub.x - n.x) * p;
        const py = n.y + (hub.y - n.y) * p;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,209,102,0.9)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(174,185,204,0.5)';
        ctx.fill();
        ctx.font = "600 11px 'Space Grotesk', sans-serif";
        ctx.fillStyle = 'rgba(224,230,242,0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y - 9);
      });
      const pulse = 8 + Math.sin(t * 2) * 3;
      const g = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, 34);
      g.addColorStop(0, 'rgba(255,203,46,0.5)');
      g.addColorStop(1, 'rgba(255,203,46,0)');
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 34, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 6 + pulse * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#FFCB2E';
      ctx.fill();
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute right-0 top-0 hidden h-full w-[46%] max-w-[620px] lg:block"
      style={{ opacity: 0.5 }}
      aria-hidden
    />
  );
}
