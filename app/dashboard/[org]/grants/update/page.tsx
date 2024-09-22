// app/grants/[grantId]/page.tsx

import { updateGrant } from "@/app/actions/grantActions";



export default async function UpdateGrantPage ( { params }: { params: { grantId: string } } )
{
  const onSubmit = async ( formData: FormData ) =>
  {
    await updateGrant( formData );
  };

  return (
    <form action={ onSubmit }>
      <input name="grantId" type="hidden" value={ params.grantId } />
      <input name="status" placeholder="Status" />
      <input name="amountApproved" type="number" placeholder="Amount Approved" />
      <textarea name="deliverables" placeholder="Deliverables" />
      <textarea name="notes" placeholder="Notes" />
      <button type="submit">Update Grant</button>
    </form>
  );
}
