"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Appointment } from "@/types/appwrite.types";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";

import StatusBadge from "../global/status-badge";
import AppointmentModal from "../global/appointment-modal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className='text-14-medium'> {row.index + 1} </p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const patient = row.original.patient;

      return <p className='text-14-medium'>{patient.name}</p>;
    },
  },
  {
    accessorKey: "schedule",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.schedule);
      //
      return (
        <p className='text-14-regular min-w-[100px]'>
          {formatDateTime(date).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className='min-w-[115px]'>
          <StatusBadge status={status} />
        </div>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doctor) => doctor.name === row.original.primaryPhysician,
      );

      return (
        <div className='flex items-center gap-3'>
          <Avatar>
            <AvatarImage src={doctor?.image} />
            <AvatarFallback> {doctor?.name} </AvatarFallback>
          </Avatar>
          <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className='pl-4'>Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className='flex gap-1'>
          <AppointmentModal
            type='schedule'
            userId={data.userId}
            patientId={data.patient.$id}
            appointment={data}
          />
          <AppointmentModal
            type='cancel'
            userId={data.userId}
            patientId={data.patient.$id}
            appointment={data}
          />
        </div>
      );
    },
  },
];
