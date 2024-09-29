import { createClient } from '@utils/supabase/client'
import { notFound } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const supabase = createClient()

interface FormField
{
  id: string
  type: string
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  order: number
}

interface Form
{
  id: string
  name: string
  description: string
  fields: FormField[]
}

async function getForm ( id: string ): Promise<Form | null>
{
  const { data: formData, error: formError } = await supabase
    .from( 'forms' )
    .select( '*' )
    .eq( 'id', id )
    .single()

  if ( formError )
  {
    console.error( 'Error loading form:', formError )
    return null
  }

  const { data: fieldsData, error: fieldsError } = await supabase
    .from( 'form_fields' )
    .select( '*' )
    .eq( 'form_id', id )
    .order( 'order', { ascending: true } )

  if ( fieldsError )
  {
    console.error( 'Error loading form fields:', fieldsError )
    return null
  }

  return {
    id: formData.id,
    name: formData.name,
    description: formData.description,
    fields: fieldsData
  }
}

export default async function SharedForm ( { params }: { params: { id: string } } )
{
  const form = await getForm( params.id )

  if ( !form )
  {
    notFound()
  }

  const renderField = ( field: FormField ) =>
  {
    switch ( field.type )
    {
      case 'text':
      case 'number':
      case 'date':
        return <Input type={ field.type } id={ field.id } placeholder={ field.placeholder } required={ field.required } />
      case 'textarea':
        return <Textarea id={ field.id } placeholder={ field.placeholder } required={ field.required } />
      case 'checkbox':
        return <Checkbox id={ field.id } />
      case 'radio':
        return (
          <RadioGroup>
            { field.options?.map( ( option, index ) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={ index } className="flex items-center space-x-2">
                <RadioGroupItem value={ option } id={ `${ field.id }-${ index }` } />
                <Label htmlFor={ `${ field.id }-${ index }` }>{ option }</Label>
              </div>
            ) ) }
          </RadioGroup>
        )
      case 'select':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              { field.options?.map( ( option, index ) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<SelectItem key={ index } value={ option }>{ option }</SelectItem>
              ) ) }
            </SelectContent>
          </Select>
        )
      case 'file':
        return <Input type="file" id={ field.id } required={ field.required } />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{ form.name }</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{ form.description }</p>
          <form className="space-y-4">
            { form.fields.map( ( field ) => (
              <div key={ field.id } className="space-y-2">
                <Label htmlFor={ field.id }>{ field.label }{ field.required && <span className="text-red-500">*</span> }</Label>
                { renderField( field ) }
              </div>
            ) ) }
            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}