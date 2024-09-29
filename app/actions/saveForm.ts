// app/actions/saveForm.ts
'use server';

import { db } from "@/db";
import { formFields, forms } from "@/db/schema";

interface FormFieldInput
{
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
}

interface SaveFormInput
{
  orgId: string; // You'll need to pass orgId from the client
  formId: string;
  name: string;
  description: string;
  fields: FormFieldInput[];
}

export async function saveFormAction ( input: SaveFormInput )
{
  const { orgId, formId, name, description, fields } = input;

  // Upsert the form metadata
  await db
    .insert( forms )
    .values( {
      id: formId,
      orgId: orgId,
      formName: name, // Use camelCase
      description: description,
      status: 'active',
    } )
    .onConflictDoUpdate( {
      target: forms.id,
      set: {
        formName: name, // Use camelCase
        description: description,
        updatedAt: new Date(),
      },
    } );

  // Upsert the form fields
  for ( const field of fields )
  {
    await db
      .insert( formFields )
      .values( {
        id: field.id,
        formId: formId, // Use camelCase
        fieldName: field.label, // Use camelCase
        fieldType: field.type, // Use camelCase
        placeholder: field.placeholder,
        options: field.options ? JSON.stringify( field.options ) : null,
        isRequired: field.required, // Use camelCase
        order: field.order,
      } )
      .onConflictDoUpdate( {
        target: formFields.id,
        set: {
          fieldName: field.label, // Use camelCase
          fieldType: field.type, // Use camelCase
          placeholder: field.placeholder,
          options: field.options ? JSON.stringify( field.options ) : null,
          isRequired: field.required, // Use camelCase
          order: field.order,
        },
      } );
  }

  // Optional: Revalidate paths if using ISR
  // await revalidatePath('/forms');
}
