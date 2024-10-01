// app/actions/saveForm.ts
'use server';

import { db } from "@/db";
import { formFields, forms } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";

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


export async function submitForm ( formData: FormData, formId: string, orgId: string )
{
  "use server";

  const supabase = createClient();

  // Collect form responses
  const responses: { [ key: string ]: any } = {};
  for ( const [ key, value ] of formData.entries() )
  {
    if ( value instanceof File )
    {
      // Handle file upload
      const { data: fileData, error: fileError } = await supabase.storage
        .from( "formImages" )
        .upload( `uploads/${ value.name }`, value );

      if ( fileError )
      {
        console.error( "Error uploading file:", fileError );
        throw new Error( "Failed to upload file" );
      }

      responses[ key ] = fileData.path; // Save the file path or URL
    } else
    {
      responses[ key ] = value;
    }
  }

  // Insert into `form_responses` table
  const { data: responseData, error: responseError } = await supabase
    .from( "form_responses" )
    .insert( {
      form_id: formId,
      org_id: orgId,
      response_data: responses, // Save the collected responses object
    } )
    .select()
    .single(); // We expect a single row to be returned

  if ( responseError )
  {
    console.error( "Error saving form response:", responseError );
    throw new Error( "Failed to save form response" );
  }

  const formResponseId = responseData?.id; // Get the generated form response ID

  // Insert each form field value into `form_response_details` table
  for ( const [ fieldKey, fieldValue ] of Object.entries( responses ) )
  {
    // Here, `fieldKey` is the form field ID and `fieldValue` is the user's input
    const { error: detailsError } = await supabase
      .from( "form_response_details" )
      .insert( {
        form_response_id: formResponseId, // Foreign key to form_responses
        form_field_id: fieldKey, // Form field ID
        field_value: fieldValue, // The user's input or uploaded file URL
      } );

    if ( detailsError )
    {
      console.error( "Error saving form response detail:", detailsError );
      throw new Error( "Failed to save form response detail" );
    }
  }

  // Optionally, return success or some other feedback
  if ( responseError )
  {
    return { success: false, message: "Form submission failed. Please try again." };
  }

  return { success: true, message: "Form submitted successfully!" };
}