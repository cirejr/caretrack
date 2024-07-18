'use client'

import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Control } from 'react-hook-form';
import { FormFieldType } from './patient-form';

interface CustomProps {
  control: Control<any>,
	fieldType: FormFieldType,
	name: string,
	label?: string,
	placeholder?: string,
	iconSrc?: string,
	iconAlt?: string,
	disabled?: boolean,
	dateFormat?: string,
	showTimeSelect?: boolean,
	children?: React.ReactNode,
	renderSkeleton?: (field: any) => React.ReactNode,
}

function RenderField({field, props}:{field: any, props: CustomProps} ) {
	return <Input type='text' placeholder="John Doe" />
}

export default function CustomFormField(props: CustomProps) {
	const {control, fieldType, name, label, placeholder, iconSrc, iconAlt} = props;
	return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex-1 '>
          {fieldType !== FormFieldType.CHECKBOX && label && (
						<FormLabel className='text-dark-700'>{label}</FormLabel>
					)}

					<RenderField field={field} props={props} />
					
					<FormMessage className='shad-error' />
        </FormItem>
      )}
    />
	);
}
