'use client';

import { createClient } from '@utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useTransition, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitForm } from '@/app/actions/formActions';
import { useToast } from "@/hooks/use-toast"

const supabase = createClient();

interface FormField
{
  id: string;
  fieldType: string;
  fieldName: string;
  placeholder?: string;
  isRequired: boolean;
  options?: string[];
  order: number;
}

interface Form
{
  id: string;
  name: string;
  description: string;
  fields: FormField[];
}

async function getForm ( formId: string ): Promise<Form | null>
{
  const { data: formData, error: formError } = await supabase
    .from( 'forms' )
    .select( '*' )
    .eq( 'id', formId )
    .single();

  if ( formError )
  {
    console.error( 'Error loading form:', formError );
    return null;
  }

  const { data: fieldsData, error: fieldsError } = await supabase
    .from( 'form_fields' )
    .select( '*' )
    .eq( 'form_id', formId ) // Fixed this part
    .order( 'order', { ascending: true } );

  if ( fieldsError )
  {
    console.error( 'Error loading form fields:', fieldsError );
    return null;
  }

  const parsedFieldsData = fieldsData?.map( ( field ) => ( {
    id: field.id,
    fieldType: field.field_type,
    fieldName: field.field_name,
    placeholder: field.placeholder,
    isRequired: field.is_required,
    options: field.options ? JSON.parse( field.options ) : null,
    order: field.order,
  } ) );

  return {
    id: formData.id,
    name: formData.form_name,
    description: formData.description,
    fields: parsedFieldsData ?? [],
  };
}

export default function SharedForm ( { params }: { params: { orgId: string; formId: string } } )
{
  const { orgId, formId } = params;
  const { toast } = useToast()
  const [ form, setForm ] = useState<Form | null>( null );
  const [ isPending, startTransition ] = useTransition();
  const { register, handleSubmit, reset } = useForm();

  useEffect( () =>
  {
    const { orgId, formId } = params;

    if ( formId && orgId )
    {
      getForm( formId ).then( setForm );
    }
  }, [ params ] );

  if ( !form )
  {
    return <div>Loading...</div>;
  }

  const onSubmit = async ( data: any ) =>
  {
    startTransition( async () =>
    {
      await submitForm( new FormData( document.getElementById( 'dynamic-form' ) as HTMLFormElement ), form.id, orgId );

      // Reset the form fields
      reset();

      // Show success toast
      toast( {
        title: 'Form Submitted',
        description: 'Your form has been successfully submitted!',
      } );
    } );
  };

  const renderField = ( field: FormField ) =>
  {
    switch ( field.fieldType )
    {
      case 'text':
      case 'number':
      case 'date':
        return (
          <Input
            type={ field.fieldType }
            id={ field.id }
            placeholder={ field.placeholder }
            required={ field.isRequired }
            { ...register( field.id ) }
          />
        );
      case 'textarea':
        return (
          <Textarea
            id={ field.id }
            placeholder={ field.placeholder }
            required={ field.isRequired }
            { ...register( field.id ) }
          />
        );
      case 'checkbox':
        return <Checkbox id={ field.id } { ...register( field.id ) } />;
      case 'radio':
        return (
          <RadioGroup { ...register( field.id ) }>
            { field.options?.map( ( option, index ) => (
              <div key={ index } className="flex items-center space-x-2">
                <RadioGroupItem value={ option } id={ `${ field.id }-${ index }` } />
                <Label htmlFor={ `${ field.id }-${ index }` }>{ option }</Label>
              </div>
            ) ) }
          </RadioGroup>
        );
      case 'select':
        return (
          <Select { ...register( field.id ) }>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              { field.options?.map( ( option, index ) => (
                <SelectItem key={ index } value={ option }>
                  { option }
                </SelectItem>
              ) ) }
            </SelectContent>
          </Select>
        );
      case 'file':
        return (
          <Input
            type="file"
            id={ field.id }
            required={ field.isRequired }
            { ...register( field.id ) }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{ form.name }</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{ form.description }</p>
          <form id="dynamic-form" onSubmit={ handleSubmit( onSubmit ) } className="space-y-4">
            { form.fields.map( ( field ) => (
              <div key={ field.id } className="space-y-2">
                <Label htmlFor={ field.id }>
                  { field.fieldName }
                  { field.isRequired && <span className="text-red-500">*</span> }
                </Label>
                { renderField( field ) }
              </div>
            ) ) }
            <Button type="submit" disabled={ isPending }>
              { isPending ? 'Submitting...' : 'Submit' }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
