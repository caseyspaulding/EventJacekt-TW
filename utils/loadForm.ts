import { FieldType } from '@/types/formTypes';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const loadForm = async ( formId: string ) =>
{
  try
  {
    // Fetch form data from the 'forms' table
    const { data: formData, error: formError } = await supabase
      .from( 'forms' )
      .select( '*' )
      .eq( 'id', formId )
      .single();

    if ( formError )
    {
      throw new Error( `Error loading form: ${ formError.message }` );
    }

    // Fetch fields data from the 'formFields' table
    const { data: fieldsData, error: fieldsError } = await supabase
      .from( 'form_fields' )
      .select( '*' )
      .eq( 'form_id', formId )
      .order( 'order', { ascending: true } );

    if ( fieldsError )
    {
      throw new Error( `Error loading form fields: ${ fieldsError.message }` );
    }

    console.log( 'Form Data:', formData );

    return {
      id: formData.id,
      name: formData.form_name, // Update to match the actual field name
      description: formData.description,
      fields: fieldsData.map( ( field: any ) => ( {
        id: field.id,
        type: field.field_type as FieldType, // Updated to match naming convention
        label: field.field_name, // Updated to match naming convention
        placeholder: field.placeholder,
        required: field.is_required, // Updated to match naming convention
        options: Array.isArray( field.options ) ? field.options : [], // Ensure options is an array
        order: field.order,
      } ) ),
    };
  } catch ( error )
  {
    console.error( error );
    throw error;
  }
};