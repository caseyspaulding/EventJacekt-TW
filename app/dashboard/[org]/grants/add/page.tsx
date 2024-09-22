// app/grants/page.tsx

import { createGrant } from "@/app/actions/grantActions";


export default function CreateGrantPage ()
{
  const onSubmit = async ( formData: FormData ) =>
  {
    await createGrant( formData );
  };

  return (
    <form action={ onSubmit }>
      <input name="grantName" placeholder="Grant Name" />
      <input name="applicantOrganization" placeholder="Applicant Organization" />
      <input name="applicationDate" type="date" placeholder="Application Date" />
      <input name="amountRequested" type="number" placeholder="Amount Requested" />
      <input name="deadline" type="date" placeholder="Deadline" />
      <textarea name="deliverables" placeholder="Deliverables" />
      <button type="submit">Submit</button>
    </form>
  );
}
