import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { v4 as uuidv4 } from 'uuid'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Trash2, Save, Share2 } from 'lucide-react'
import { saveFormAction } from '@/app/actions/formActions';
import { useSearchParams } from 'next/navigation'
import { loadForm } from '@/utils/loadForm'
import ShareFormModal from './ShareFormModal'


type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'radio' | 'select' | 'date' | 'file'

interface FormField
{
  id: string
  type: FieldType
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

const initialForm: Form = {
  id: '',
  name: '',
  description: '',
  fields: []
}

interface FormEditorProps
{
  orgId: string;  // Org ID to associate with the form
  formId: string; // Form ID to load the form
  user: any;     // User object
}

export function FormEditorComponent ( { orgId, formId, user }: FormEditorProps )
{
  const [ form, setForm ] = useState<Form>( initialForm );
  const [ activeTab, setActiveTab ] = useState<'builder' | 'preview'>( 'builder' );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState<string | null>( null );

  useEffect( () =>
  {
    const load = async () =>
    {
      if ( formId )
      {
        setLoading( true );
        try
        {
          const formData = await loadForm( formId );
          console.log( "Loaded Form Data:", formData );
          setForm( formData );
        } catch ( error )
        {
          console.error( 'Error loading form data:', error );
          setError( 'Failed to load form data. Please try again.' );
        } finally
        {
          setLoading( false );
        }
      }
    };

    load();
  }, [ formId ] );

  if ( loading )
  {
    return <div>Loading form data...</div>;
  }

  if ( error )
  {
    return <div className="text-red-500">{ error }</div>;
  }

  const onDragEnd = ( result: any ) =>
  {
    if ( !result.destination ) return

    const items = Array.from( form.fields )
    const [ reorderedItem ] = items.splice( result.source.index, 1 )
    items.splice( result.destination.index, 0, reorderedItem )

    const updatedFields = items.map( ( field, index ) => ( { ...field, order: index } ) )
    setForm( { ...form, fields: updatedFields } )
  }

  const addField = ( type: FieldType ) =>
  {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: `New ${ type } field`,
      placeholder: `Enter ${ type }`,
      required: false,
      options: type === 'radio' || type === 'select' ? [ 'Option 1', 'Option 2' ] : undefined,
      order: form.fields.length
    }
    setForm( { ...form, fields: [ ...form.fields, newField ] } )
  }

  const removeField = ( id: string ) =>
  {
    setForm( { ...form, fields: form.fields.filter( field => field.id !== id ) } )
  }

  const updateField = ( id: string, updates: Partial<FormField> ) =>
  {
    setForm( {
      ...form,
      fields: form.fields.map( field =>
        field.id === id ? { ...field, ...updates } : field
      )
    } )
  }

  const saveForm = async () =>
  {
    const input = {
      orgId: orgId,
      formId: form.id || uuidv4(),
      name: form.name,
      description: form.description,
      fields: form.fields,
      creator_id: user.id, // Add the creator_id property here
    };

    try
    {
      await saveFormAction( input );
      alert( 'Form saved successfully!' );
    } catch ( error )
    {
      console.error( 'Error saving form:', error );
      alert( 'Error saving form. Please try again.' );
    }
  };



  
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
      <h1 className="text-3xl font-bold mb-4">Form Editor</h1>
      <div className="mb-4">
        <Input
          value={ form.name }
          onChange={ ( e ) => setForm( { ...form, name: e.target.value } ) }
          placeholder="Form Name"
          className="text-2xl font-bold mb-2"
        />
        <Textarea
          value={ form.description }
          onChange={ ( e ) => setForm( { ...form, description: e.target.value } ) }
          placeholder="Form Description"
        />
      </div>
      <Tabs value={ activeTab } onValueChange={ ( value: string ) => setActiveTab( value as 'builder' | 'preview' ) }>
        <TabsList className="mb-4">
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="builder">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/4">
              <Card>
                <CardHeader>
                  <CardTitle>Add Form Elements</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  { ( [ 'text', 'textarea', 'number', 'checkbox', 'radio', 'select', 'date', 'file' ] as FieldType[] ).map( ( type ) => (
                    <Button
                      key={ type }
                      onClick={ () => addField( type ) }
                      className="w-full flex items-center justify-start"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add { type.charAt( 0 ).toUpperCase() + type.slice( 1 ) }
                    </Button>
                  ) ) }
                </CardContent>

              </Card>
              <div className="mt-4 space-y-2">
                <Button onClick={ saveForm } className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Save Form
                </Button>
                <ShareFormModal form={ form } orgId={ orgId } />
               
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={ onDragEnd }>
                    <Droppable droppableId="form-fields">
                      { ( provided ) => (
                        <div { ...provided.droppableProps } ref={ provided.innerRef } className="space-y-4">
                          { form.fields.map( ( field, index ) => (
                            <Draggable key={ field.id } draggableId={ field.id } index={ index }>
                              { ( provided ) => (
                                <div
                                  ref={ provided.innerRef }
                                  { ...provided.draggableProps }
                                  { ...provided.dragHandleProps }
                                  className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <Input
                                      value={ field.label }
                                      onChange={ ( e ) => updateField( field.id, { label: e.target.value } ) }
                                      className="font-semibold"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={ () => removeField( field.id ) }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    <Input
                                      value={ field.placeholder }
                                      onChange={ ( e ) => updateField( field.id, { placeholder: e.target.value } ) }
                                      placeholder="Placeholder text"
                                    />
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        id={ `${ field.id }-required` }
                                        checked={ field.required }
                                        onCheckedChange={ ( checked ) => updateField( field.id, { required: checked } ) }
                                      />
                                      <Label htmlFor={ `${ field.id }-required` }>Required</Label>
                                    </div>
                                    { ( field.type === 'radio' || field.type === 'select' ) && (
                                      <Textarea
                                        value={ field.options?.join( '\n' ) }
                                        onChange={ ( e ) => updateField( field.id, { options: e.target.value.split( '\n' ) } ) }
                                        placeholder="Enter options (one per line)"
                                      />
                                    ) }
                                  </div>
                                </div>
                              ) }
                            </Draggable>
                          ) ) }
                          { provided.placeholder }
                        </div>
                      ) }
                    </Droppable>
                  </DragDropContext>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
            </CardHeader>
            <CardContent>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
