"use client"

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormField from './custom-form-field';

export enum FormFieldType {
	INPUT= 'input',
	SELECT= 'select',
	TEXTAREA= 'textarea',
	CHECKBOX= 'checkbox',
	PHONE_INPUT= 'phoneInput',
	DATE_PICKER= 'datePicker',
	SKELETON= 'skeleton',
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export default function PatientForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
				<section className='mb-12 space-y-4'>
					<h1 className='header '>Hi there 👋</h1>
					<p className='text-dark-700'>Schedule your first appointment.</p>
				</section>
				<CustomFormField 
					fieldType={FormFieldType.INPUT} 
					control={form.control} 
					name="name" 
					label='Full Name' 
					placeholder='John Doe' 
					iconSrc='/assets/icons/user.svg' 
					iconAlt='user'
				/>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

