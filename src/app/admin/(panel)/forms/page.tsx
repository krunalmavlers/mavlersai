import Link from 'next/link';
import { adminListForms } from '@/lib/adminQueries';
import { PageHeader, Card, LinkButton } from '@/components/admin/ui';

export default async function FormsList() {
  const forms = await adminListForms();
  return (
    <div>
      <PageHeader
        title="Forms"
        subtitle="Dynamic forms with reCAPTCHA, email + database capture."
        action={<LinkButton href="/admin/forms/new">+ New form</LinkButton>}
      />
      <Card className="p-0">
        <table className="w-full text-left text-[14px]">
          <thead className="border-b border-white/9 text-[12px] uppercase tracking-wide text-body-dim">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Key</th>
              <th className="p-4">reCAPTCHA</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form.id} className="border-b border-white/6 last:border-0">
                <td className="p-4 font-semibold text-white">{form.name}</td>
                <td className="p-4 text-body-faint">{form.key}</td>
                <td className="p-4 text-body-faint">{form.recaptcha_enabled ? 'on' : 'off'}</td>
                <td className="p-4 text-right">
                  <Link href={`/admin/forms/${form.id}`} className="font-semibold text-brand">
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
