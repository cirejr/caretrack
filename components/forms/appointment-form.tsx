"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "./custom-form-field";
import SubmitButton from "./submit-button";
import { getAppointmentSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormFieldType } from "./patient-form";
import { Doctors, Specialties } from "@/constants";
import { SelectItem } from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { createAppointment } from "@/lib/actions/appointment";

export default function AppointmentForm({
  userId,
  patientId,
  type,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const appointmentSchema = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      specialty: "",
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof appointmentSchema>) {
    setIsLoading(true);
    let status;
    switch (type) {
      case "cancel":
        status = "cancelled";
        break;
      case "schedule":
        status = "scheduled";
        break;
      default:
        status = "pending";
        break;
    }

    let response;
    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId: userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          specialty: values.specialty,
          reason: values.reason as string,
          schedule: new Date(values.schedule),
          note: values.note,
          status: status as Status,
        };
        response = await createAppointment(appointmentData);
      }
      console.log("response", response);
      if (response.status === 200) {
        form.reset();
        router.push(
          `/patients/${userId}/new-appointment/success?appointmentId=${response.data.$id}`,
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
    setIsLoading(false);
  }

  let buttonText;
  switch (type) {
    case "create":
      buttonText = "Create Appointment";
      break;
    case "cancel":
      buttonText = "Cancel Appointment";
      break;
    case "schedule":
      buttonText = "Schedule Appointment";
      break;
    default:
      buttonText = "Create Appointment";
      break;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 flex-1'>
        <section className='mb-12 space-y-4'>
          <h1 className='header '>New Appointment</h1>
          <p className='text-dark-700'>
            Request a new appointment in 10 seconds
          </p>
        </section>

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name='specialty'
              label='Specialty'
              placeholder='Select the specialty of the doctor'
            >
              {Specialties.map((specialty) => (
                <SelectItem key={specialty.value} value={specialty.value}>
                  {specialty.name}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name='primaryPhysician'
              label='Doctore'
              placeholder='Select a doctor'
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className='flex cursor-pointer items-center gap-2'>
                    <Avatar className='flex items-center border-2 border-green-500 h-9 w-9'>
                      <AvatarImage className='h-8 w-8 ' src={doctor.image} />
                      <AvatarFallback>{doctor.name}</AvatarFallback>
                    </Avatar>
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <div className='flex flex-col gap-6 xl:flex-row'>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name='reason'
                label='Reason for Appointment'
                placeholder='ex: Annual check-up, Urgent appointment'
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name='notes'
                label='Additional Comments/Notes'
                placeholder='ex: Prefer afternoon appointment'
              />
            </div>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              showTimeSelect
              dateFormat='dd/MM/yyyy - hh:mm'
              name='birthdate'
              label='Expected Appointment Date'
              placeholder='select your appointment date'
              iconSrc='/assets/icons/calendar.svg'
              iconAlt='calendar'
            />
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name='cancellationReason'
            label='Reason for Cancellation'
            placeholder='Enter the reason for cancellation'
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonText}
        </SubmitButton>
      </form>
    </Form>
  );
}
