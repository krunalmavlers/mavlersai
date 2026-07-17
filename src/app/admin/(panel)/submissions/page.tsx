import { adminListSubmissions } from '@/lib/adminQueries';
import { PageHeader, Card } from '@/components/admin/ui';
import { SubmissionRow } from '@/components/admin/SubmissionRow';

export default async function SubmissionsPage() {
  const submissions = await adminListSubmissions();
  return (
    <div>
      <PageHeader title="Submissions" subtitle="Form submissions captured from the site." />
      {submissions.length === 0 ? (
        <Card>
          <p className="m-0 text-[14px] text-body-dim">No submissions yet.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {submissions.map((s: any) => (
            <SubmissionRow key={s.id} submission={s} />
          ))}
        </div>
      )}
    </div>
  );
}
