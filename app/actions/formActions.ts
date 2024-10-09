// app/actions/saveForm.ts
'use server';

import { db } from "@/db";
import { formFields, formResponses, forms } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";

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
  orgId: string;
  formId: string;
  name: string;
  description: string;
  fields: FormFieldInput[];
  isArchived?: boolean;
  isDeleted?: boolean;
  isDraft?: boolean;  // Add draft flag
}


export async function saveFormAction ( input: SaveFormInput )
{
  const { orgId, formId, name, description, fields, isArchived, isDeleted, isDraft } = input;

  // Upsert the form metadata
  await db
    .insert( forms )
    .values( {
      id: formId,
      orgId: orgId,
      formName: name,
      description: description,
      status: 'active',
      isArchived: isArchived || false,
      isDeleted: isDeleted || false,
      isDraft: isDraft || true, // Default to true (draft mode)
    } )
    .onConflictDoUpdate( {
      target: forms.id,
      set: {
        formName: name,
        description: description,
        updatedAt: new Date(),
        isArchived: isArchived || false,
        isDeleted: isDeleted || false,
        isDraft: isDraft || true, // Update the draft status
      },
    } );

  // Upsert the form fields as usual
  for ( const field of fields )
  {
    await db
      .insert( formFields )
      .values( {
        id: field.id,
        formId: formId,
        fieldName: field.label,
        fieldType: field.type,
        placeholder: field.placeholder,
        options: field.options ? JSON.stringify( field.options ) : null,
        isRequired: field.required,
        order: field.order,
      } )
      .onConflictDoUpdate( {
        target: formFields.id,
        set: {
          fieldName: field.label,
          fieldType: field.type,
          placeholder: field.placeholder,
          options: field.options ? JSON.stringify( field.options ) : null,
          isRequired: field.required,
          order: field.order,
        },
      } );
  }
}



export async function getActiveForms ( orgId: string )
{
  const supabase = createClient();

  try
  {
    const { data: activeForms, error } = await supabase
      .from( 'forms' )
      .select( '*' )
      .eq( 'org_id', orgId )
      .eq( 'is_archived', false )
      .eq( 'is_deleted', false )
      .eq( 'is_draft', false ); // Fetch only active forms

    if ( error )
    {
      throw new Error( 'Error fetching active forms' );
    }

    return activeForms;
  } catch ( error )
  {
    console.error( 'Error in getActiveForms:', error );
    return [];
  }
}

export async function getDraftForms ( orgId: string )
{
  const supabase = createClient();

  try
  {
    const { data: draftForms, error } = await supabase
      .from( 'forms' )
      .select( '*' )
      .eq( 'org_id', orgId )
      .eq( 'is_draft', true ); // Fetch only draft forms

    if ( error )
    {
      throw new Error( 'Error fetching draft forms' );
    }

    return draftForms;
  } catch ( error )
  {
    console.error( 'Error in getDraftForms:', error );
    return [];
  }
}

export async function getArchivedForms ( orgId: string )
{
  const supabase = createClient();

  try
  {
    const { data: archivedForms, error } = await supabase
      .from( 'forms' )
      .select( '*' )
      .eq( 'org_id', orgId )
      .eq( 'is_archived', true )
      .eq( 'is_deleted', false )
      .eq( 'is_draft', false ); // Fetch archived forms

    if ( error )
    {
      throw new Error( 'Error fetching archived forms' );
    }

    return archivedForms;
  } catch ( error )
  {
    console.error( 'Error in getArchivedForms:', error );
    return [];
  }
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

export async function publishForm ( formId: string, orgId: string )
{
  const supabase = createClient();

  try
  {
    const { error: publishError } = await supabase
      .from( 'forms' )
      .update( { is_draft: false } ) // Mark as no longer a draft
      .eq( 'id', formId )
      .eq( 'org_id', orgId );

    if ( publishError )
    {
      throw new Error( 'Failed to publish form' );
    }

    return { success: true };
  } catch ( error )
  {
    console.error( 'Error publishing form:', error );
    throw new Error( 'Failed to publish form' );
  }
}

export async function getForms ( organizationId: string )
{
  const supabase = createClient();

  if ( !organizationId )
  {
    throw new Error( 'Organization ID is required' );
  }

  try
  {
    const { data: formsData, error: formsError } = await supabase
      .from( 'forms' )
      .select( '*' )
      .eq( 'org_id', organizationId );

    if ( formsError )
    {
      throw new Error( 'Failed to fetch forms' );
    }

    return formsData;
  } catch ( error )
  {
    console.error( 'Error fetching forms:', error );
    throw new Error( 'Failed to fetch forms' );
  }
}




export async function deleteForm ( formId: string, orgId: string )
{
  const supabase = createClient();

  try
  {
    // Soft-delete the form by setting the isDeleted flag to true
    const { error: formError } = await supabase
      .from( 'forms' )
      .update( { is_deleted: true } ) // Mark as deleted
      .eq( 'id', formId )
      .eq( 'org_id', orgId ); // Ensure the form belongs to the org

    if ( formError )
    {
      throw new Error( 'Failed to soft-delete form' );
    }

    return { success: true };
  } catch ( error )
  {
    console.error( 'Error deleting form:', error );
    throw new Error( 'Failed to delete form' );
  }
}

export async function archiveForm ( formId: string, orgId: string )
{
  const supabase = createClient();

  try
  {
    // Mark the form as archived
    const { error: archiveError } = await supabase
      .from( 'forms' )
      .update( { is_archived: true, status: 'archived' } ) // Mark as archived
      .eq( 'id', formId )
      .eq( 'org_id', orgId );

    if ( archiveError )
    {
      throw new Error( 'Failed to archive form' );
    }

    return { success: true };
  } catch ( error )
  {
    console.error( 'Error archiving form:', error );
    throw new Error( 'Failed to archive form' );
  }
}

export async function getFormResponses ( formId: string )
{
  return await db
    .select( {
      responseId: formResponses.id,
      responseData: formResponses.responseData,
      submittedAt: formResponses.submittedAt,
    } )
    .from( formResponses )
    .where( eq( formResponses.formId, formId ) );
}

export async function getFormFields ( formId: string )
{
  return await db
    .select( {
      fieldId: formFields.id,
      fieldName: formFields.fieldName,
    } )
    .from( formFields )
    .where( eq( formFields.formId, formId ) );
}