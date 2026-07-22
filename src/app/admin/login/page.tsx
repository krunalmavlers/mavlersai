import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { getSettings } from '@/lib/queries';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Admin Login', robots: { index: false } };

export default async function LoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect('/admin');
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-tint2 px-5">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          {settings.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo_url} alt="Mavlers.ai" style={{ height: 40, width: 'auto' }} />
          ) : (
            <div className="font-display text-[26px] font-bold text-black">
              Mavlers<span className="text-brand-ink">.ai</span>
            </div>
          )}
          <div className="mt-2 text-[13px] text-body-dim">Content management</div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
