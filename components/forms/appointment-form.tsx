"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { SelectItem } from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";

import CustomFormField from "./custom-form-field";
import SubmitButton from "./submit-button";
import { FormFieldType } from "./patient-form";

import { Doctors, Specialties } from "@/constants";
import { getAppointmentSchema } from "@/lib/validations";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment";
import { Appointment } from "@/types/appwrite.types";
import { formatDateTime } from "@/lib/utils";

export default function AppointmentForm({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const appointmentSchema = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      specialty: type === "create" ? "" : appointment?.specialty,
      primaryPhysician: type === "create" ? "" : appointment?.primaryPhysician,
      schedule:
        type === "create"
          ? new Date()
          : new Date(appointment?.schedule as Date),
      reason: type === "create" ? "" : appointment?.reason,
      note: type === "create" ? "" : appointment?.note,
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
      } else {
        const appointmentToUpdate = {
          userId: userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            specialty: values?.specialty,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values?.cancellationReason,
          },
          type,
        };
        response = await updateAppointment(appointmentToUpdate);
      }
      if (response.status === 200) {
        if (appointment && setOpen) {
          form.reset();
          setOpen(false);
          toast.success("Appointment updated successfully");
        } else {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${response.data.$id}`,
          );
        }
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
      buttonText = "Confirm Appointment";
      break;
    default:
      buttonText = "Create Appointment";
      break;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 flex-1'>
        {type === "create" && (
          <section className='mb-12 space-y-4'>
            <h1 className='header '>New Appointment</h1>
            <p className='text-dark-700'>
              Request a new appointment in 10 seconds
            </p>
          </section>
        )}

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
                disabled={type === "schedule"}
                name='reason'
                label='Reason for Appointment'
                placeholder='ex: Annual check-up, Urgent appointment'
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                disabled={type === "schedule"}
                name='note'
                label='Additional Notes'
                placeholder='ex: Prefer afternoon appointment'
              />
            </div>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              showTimeSelect
              dateFormat='dd/MM/yyyy - hh:mm'
              name='schedule'
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
