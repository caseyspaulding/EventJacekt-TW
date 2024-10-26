// app/grants/[grantId]/page.tsx

import { updateGrant } from "@/app/actions/grantActions";

type UpdateGrantPageProps = {
  params: Promise<{ grantId: string }>;
};

export default async function UpdateGrantPage ( { params }: UpdateGrantPageProps )
{
  const { grantId } = await params;

  const onSubmit = async ( event: React.FormEvent<HTMLFormElement> ) =>
  {
    event.preventDefault();
    const formData = new FormData( event.currentTarget );
    await updateGrant( formData );
  };

  return (
    <form onSubmit={ onSubmit }>
      <input name="grantId" type="hidden" value={ grantId } />
      <input name="status" placeholder="Status" />
      <input name="amountApproved" type="number" placeholder="Amount Approved" />
      <textarea name="deliverables" placeholder="Deliverables" />
      <textarea name="notes" placeholder="Notes" />
      <button type="submit">Update Grant</button>
    </form>
  );
}
