'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createSignupSheet, createSignupSheetSlot, getSignupSheetGroups } from '@/app/actions/signupActions';

interface SignupSheetCreatorProps
{
  orgId: string;
  creatorId: string; // This would be the userId
}

interface SignupSheetGroup
{
  id: string;
  name: string;
}

export default function SignupSheetCreator ( { orgId, creatorId }: SignupSheetCreatorProps )
{
  const [ title, setTitle ] = useState( '' );
  const [ description, setDescription ] = useState( '' );
  const [ group, setGroup ] = useState( '' );
  const [ eventType, setEventType ] = useState( '' );
  const [ eventCategory, setEventCategory ] = useState( '' );
  const [ slots, setSlots ] = useState( [
    { title: '', date: '', startTime: '', endTime: '', quantity: 1, description: '' }
  ] );

  const [ groups, setGroups ] = useState<SignupSheetGroup[]>( [] ); // State to hold the groups
  const [ loading, setLoading ] = useState( false ); // Loading state for fetching groups


  // Fetch groups on component mount
  useEffect( () =>
  {
    async function fetchGroups ()
    {
      setLoading( true ); // Set loading to true while fetching
      try
      {
        const fetchedGroups = await getSignupSheetGroups( orgId ); // Fetch groups from server
        setGroups( fetchedGroups ); // Set the fetched groups in state
      } catch ( error )
      {
        console.error( 'Error fetching signup sheet groups:', error );
      } finally
      {
        setLoading( false ); // Stop loading once fetching is done
      }
    }
    fetchGroups();
  }, [ orgId ] ); // Run this effect when orgId changes

  // Add a new slot to the slots array
  const addSlot = () =>
  {
    setSlots( [ ...slots, { title: '', date: '', startTime: '', endTime: '', quantity: 1, description: '' } ] );
  };

  const updateSlot = ( index: number, field: string, value: string | number ) =>
  {
    const updatedSlots = slots.map( ( slot, i ) =>
    {
      if ( i === index )
      {
        return { ...slot, [ field ]: value };
      }
      return slot;
    } );
    setSlots( updatedSlots );
  };

  const removeSlot = ( index: number ) =>
  {
    setSlots( slots.filter( ( _, i ) => i !== index ) );
  };

  const handleSubmit = async () =>
  {
    try
    {
      const signupSheetData = {
        orgId,  // Use orgId from props
        creatorId,  // Use creatorId from props
        title,
        description,
        groupId: group,
        eventType,
        eventCategory,
        slug: title.toLowerCase().replace( /\s+/g, '-' ),  // Generate slug from title
        isPublished: false,  // Example: Adjust based on logic
        attachmentUrls: [],  // Handle attachments if necessary
      };

      // Call server action to create the signup sheet
      const newSignupSheet = await createSignupSheet( signupSheetData );

      // Loop over slots and create them
      for ( const slot of slots )
      {
        const slotData = {
          title: slot.title,
          startTimestamp: new Date( `${ slot.date }T${ slot.startTime }` ),
          endTimestamp: new Date( `${ slot.date }T${ slot.endTime }` ),
          quantity: slot.quantity,
          signupSheetId: newSignupSheet.id,
          description: slot.description,
        };
        await createSignupSheetSlot( slotData );
      }

      console.log( 'Signup sheet created successfully!' );
    } catch ( error )
    {
      console.error( 'Error creating signup sheet:', error );
    }
  };

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
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  { loading ? (
                    <SelectItem value={ 'select group' } >Loading...</SelectItem>
                  ) : (
                    groups.map( ( group ) => (
                      <SelectItem key={ group.id } value={ group.id }>
                        { group.name }
                      </SelectItem>
                    ) )
                  ) }
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
                onChange={ ( e ) => updateSlot( index, 'quantity', parseInt( e.target.value ) ) }
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
        <Button onClick={ handleSubmit }>Publish</Button>
      </div>
    </div>
  );
}
