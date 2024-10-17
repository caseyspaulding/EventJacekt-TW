import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export default function SignupSheetCreator ()
{
  const [ title, setTitle ] = useState( '' )
  const [ description, setDescription ] = useState( '' )
  const [ group, setGroup ] = useState( '' )
  const [ eventType, setEventType ] = useState( '' )
  const [ eventCategory, setEventCategory ] = useState( '' )
  const [ slots, setSlots ] = useState<{ title: string, date: string, startTime: string, endTime: string, quantity: number, description: string }[]>( [] )

  const addSlot = () =>
  {
    setSlots( [ ...slots, { title: '', date: '', startTime: '', endTime: '', quantity: 1, description: '' } ] )
  }

  const updateSlot = ( index: number, field: string, value: string | number ) =>
  {
    const updatedSlots = slots.map( ( slot, i ) =>
    {
      if ( i === index )
      {
        return { ...slot, [ field ]: value }
      }
      return slot
    } )
    setSlots( updatedSlots )
  }

  const removeSlot = ( index: number ) =>
  {
    setSlots( slots.filter( ( _, i ) => i !== index ) )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Sign Up — Volunteer Sign Up</h1>
      <Tabs defaultValue="design">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="slots">Slots</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="publish">Publish</TabsTrigger>
        </TabsList>
        <TabsContent value="design" className="space-y-4">
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="title">Title of Sign Up</Label>
            <Input
              id="title"
              placeholder="Volunteer Sign Up"
              value={ title }
              onChange={ ( e ) => setTitle( e.target.value ) }
            />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="group">Group</Label>
            <div className="flex items-center gap-2">
              <Select value={ group } onValueChange={ setGroup }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Set Up" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="setup">Set Up</SelectItem>
                  <SelectItem value="cleanup">Clean Up</SelectItem>
                  <SelectItem value="registration">Registration</SelectItem>
                </SelectContent>
              </Select>
              <Button size="icon" variant="outline">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add new group</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="type">Type/Category</Label>
            <div className="flex gap-2">
              <Select value={ eventType } onValueChange={ setEventType }>
                <SelectTrigger>
                  <SelectValue placeholder="General" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="specific">Specific</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ eventCategory } onValueChange={ setEventCategory }>
                <SelectTrigger>
                  <SelectValue placeholder="Civic & Community" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="civic">Civic & Community</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-start gap-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              value={ description }
              onChange={ ( e ) => setDescription( e.target.value ) }
            />
          </div>
        </TabsContent>
        <TabsContent value="slots" className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Slots</h2>
          { slots.map( ( slot, index ) => (
            <div key={ index } className="border p-4 rounded-md space-y-2">
              <Input
                placeholder="Slot Title"
                value={ slot.title }
                onChange={ ( e ) => updateSlot( index, 'title', e.target.value ) }
              />
              <Input
                type="date"
                value={ slot.date }
                onChange={ ( e ) => updateSlot( index, 'date', e.target.value ) }
              />
              <div className="flex space-x-2">
                <Input
                  type="time"
                  value={ slot.startTime }
                  onChange={ ( e ) => updateSlot( index, 'startTime', e.target.value ) }
                />
                <Input
                  type="time"
                  value={ slot.endTime }
                  onChange={ ( e ) => updateSlot( index, 'endTime', e.target.value ) }
                />
              </div>
              <Input
                type="number"
                placeholder="Quantity"
                value={ slot.quantity }
                onChange={ ( e ) => updateSlot( index, 'quantity', e.target.value ) }
              />
              <Textarea
                placeholder="Slot Description (optional)"
                value={ slot.description }
                onChange={ ( e ) => updateSlot( index, 'description', e.target.value ) }
              />
              <Button variant="destructive" onClick={ () => removeSlot( index ) }>Remove Slot</Button>
            </div>
          ) ) }
          <Button onClick={ addSlot }>Add Slot</Button>
        </TabsContent>
        <TabsContent value="settings">
          <p>Settings content (to be implemented)</p>
        </TabsContent>
        <TabsContent value="publish">
          <p>Publish content (to be implemented)</p>
        </TabsContent>
      </Tabs>
      <div className="flex space-x-2 mt-6">
        <Button variant="outline">Save as Draft</Button>
        <Button>Publish</Button>
      </div>
    </div>
  )
}