import { notFound } from 'next/navigation';
import { adminGetForm } from '@/lib/adminQueries';
import { PageHeader } from '@/components/admin/ui';
import { FormEditor } from '@/components/admin/FormEditor';

export default async function FormEdit({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new';
  let form: any;
  if (isNew) {
    form = {
      key: '',
      name: '',
      title: '',
      description: '',
      submit_label: 'Submit',
      success_message: 'Thanks — we got it.',
      recipient_emails: [],
      recaptcha_enabled: true,
      settings: {},
      fields: [],
    };
  } else {
    form = await adminGetForm(params.id);
    if (!form) notFound();
  }
  return (
    <div>
      <PageHeader title={isNew ? 'New form' : `Edit: ${form.name}`} subtitle="Fields, recipients, reCAPTCHA and behaviour." />
      <FormEditor form={form} isNew={isNew} />
    </div>
  );
}
