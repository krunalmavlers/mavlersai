import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-page">
        <h1 className="text-[clamp(36px,5vw,56px)] font-extrabold tracking-[-0.04em] text-black">Page not found.</h1>
        <p className="mt-4 max-w-[42ch] text-[16.5px] leading-relaxed text-body-muted">
          That address is not on this site.
        </p>
      </div>
    </section>
  );
}
