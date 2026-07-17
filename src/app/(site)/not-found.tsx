import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 font-display text-[80px] font-bold leading-none text-brand">404</div>
      <h1 className="m-0 mb-3 font-display text-[28px] font-bold text-white">Page not found</h1>
      <p className="m-0 mb-8 max-w-[420px] text-[15px] text-body-faint">
        The page you are looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="rounded-[12px] bg-brand px-7 py-3.5 text-[15px] font-bold text-ink hover:bg-brand-300"
      >
        Back to home
      </Link>
    </section>
  );
}
