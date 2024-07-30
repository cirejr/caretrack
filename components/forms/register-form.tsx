"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormItem } from "@/components/ui/form";
import CustomFormField from "./custom-form-field";
import SubmitButton from "./submit-button";
import { patientFormValidation } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient";
import { toast } from "sonner";
import { FormFieldType } from "./patient-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import {
  Doctors,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { SelectItem } from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FileUploader from "./file-uploader";

export default function RegisterForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof patientFormValidation>>({
    resolver: zodResolver(patientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    },
  });

  async function onSubmit(values: z.infer<typeof patientFormValidation>) {
    setIsLoading(true);
    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        identificationDocument: formData,
      };
      //@ts-ignore
      const res = await registerPatient(patientData);
      if (res.status === 201) {
        toast.success("Patient created successfully");
        router.push(`/patients/${user.$id}/new-appointment`);
      } else {
        toast.error(res.error);
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
    setIsLoading(false);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-12 flex-1'
      >
        <section className='space-y-4'>
          <h1 className='header '>Welcome 👋</h1>
          <p className='text-dark-700'>Let us know more about yourself...</p>
        </section>

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-heading'>Personal Information.</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='name'
          label='Full Name'
          placeholder='John Doe'
          iconSrc='/assets/icons/user.svg'
          iconAlt='user'
        />

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='email'
            label='Email'
            placeholder='myemail@gmail.com'
            iconSrc='/assets/icons/email.svg'
            iconAlt='email'
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name='phone'
            label='Phone number'
            placeholder='77 123 45 67'
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name='birthdate'
            label='Birthdate'
            placeholder='select your birthdate'
            iconSrc='/assets/icons/calendar.svg'
            iconAlt='calendar'
          />
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name='gender'
            label='Gender'
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className='flex h-11 gap-6 xl:justify-between'
                  onChange={field.onChange}
                  defaultValue={field.value}
                >
                  <div className='radio-group'>
                    <RadioGroupItem value='male' id='male' />
                    <Label htmlFor='male' className='cursor-pointer'>
                      Male
                    </Label>
                  </div>
                  <div className='radio-group'>
                    <RadioGroupItem value='female' id='female' />
                    <Label htmlFor='female' className='cursor-pointer'>
                      Female
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='address'
            label='Address'
            placeholder='Dakar, Hlm Grand Yoff 139'
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='occupation'
            label='Occupation'
            placeholder='Software Engineer'
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='emergencyContactName'
            label='Emergency Contact Name'
            placeholder="Guardian's Name"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name='emergencyContactNumber'
            label='Emergency Contact Number'
            placeholder='77 123 45 67'
          />
        </div>

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-heading'>Medical Information</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name='primaryPhysician'
          label='Primary Physician'
          placeholder='Select a physician'
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className='flex cursor-pointer items-center gap-2'>
                <Avatar className='flex items-center border-2 border-green-500 h-9 w-9'>
                  <AvatarImage className='h-8 w-8 ' src={doctor.image} />
                  <AvatarFallback>{doctor.name}</AvatarFallback>
                </Avatar>

                {/* <Image
                  src={doctor.image}
                  alt={doctor.name}
                  width={32}
                  height={32}
                  className='rounded-full border-2 border-green-500'
                /> */}
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='insuranceProvider'
            label='Insurance Provider'
            placeholder='ex: Blue Cross Blue Shield'
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='insurancePolicyNumber'
            label='Insurance Policy Number'
            placeholder='ex: 123456789'
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name='allergies'
            label='Allergies(if any)'
            placeholder='ex: Penicillin, Peanuts'
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name='currentMedication'
            label='Current Medicine'
            placeholder='ex: Paracetamol,  Ibuprofen 200mg'
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name='familyMedicalHistory'
            label='Family Medical History (if relevant)'
            placeholder='ex: Diabetes, Hypertension, Asthma'
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name='pastMedicalHistory'
            label='Past Medical History'
            placeholder='ex: Asthma diagnosed in 2018'
          />
        </div>

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-heading'>Identification and Verification</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name='identificationType'
          label='Identification Type'
          placeholder='Select a identification type'
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='identificationNumber'
          label='Identification Number'
          placeholder='ex: 123456789'
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name='identificationDocument'
          label='Scanned copy of identification document'
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-heading'>Consent and Privacy</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name='treatmentConsent'
          label='I consent to treatment'
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name='disclosureConsent'
          label='I consent to disclosure information'
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name='privacyConsent'
          label='I consent to privacy information'
        />

        <div className='flex flex-col gap-6 xl:flex-row'></div>

        <SubmitButton isLoading={isLoading}>Commencer</SubmitButton>
      </form>
    </Form>
  );
}
