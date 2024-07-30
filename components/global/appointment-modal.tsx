"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import AppointmentForm from "../forms/appointment-form";
import { Appointment } from "@/types/appwrite.types";

export default function AppointmentModal({
  type,
  userId,
  patientId,
  appointment,
}: {
  type: "schedule" | "cancel";
  userId: string;
  patientId: string;
  appointment?: Appointment;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className={`capitalize ${type === "schedule" && "text-green-500"}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className='shad-dialog sm:max-w-md'>
        <DialogHeader className='mb-4 space-y-3'>
          <DialogTitle className='capitalize'>{type}</DialogTitle>
          <DialogDescription>
            Please fill in the following details to {type} the appointment.
          </DialogDescription>
        </DialogHeader>
        <AppointmentForm
          type={type}
          userId={userId}
          patientId={patientId}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
