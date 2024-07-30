import React from "react";
import Image from "next/image";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Doctors } from "@/constants";
import { getUser } from "@/lib/actions/patient";
import { getAppointment } from "@/lib/actions/appointment";
import { formatDateTime } from "@/lib/utils";

export default async function Success({
  params: { userId },
  searchParams,
}: SearchParamProps) {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);
  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment?.primaryPhysician,
  );
  const user = await getUser(userId);

  Sentry.metrics.set("user_view_appointment-success", user?.name);

  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
      <div className='success-img'>
        <Link href='/'>
          <Image
            src='/assets/icons/logo-full.svg'
            alt='logo'
            width={1000}
            height={1000}
            className='mb-12 h-10 w-fit'
          />
        </Link>
        <section className='flex flex-col items-center'>
          <Image
            src='/assets/gifs/success.gif'
            width={280}
            height={300}
            alt='success'
          />
          <h2 className='header mb-6 text-center max-w-[600px]'>
            Your <span className='text-green-500'>appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We will get back to you shortly to confirm.</p>
        </section>

        <section className='request-details'>
          <p>Requested Appointment Details : </p>
          <div className='flex items-center gap-3'>
            <Avatar className='size-6'>
              <AvatarImage src={doctor?.image} alt={doctor?.name} />
              <AvatarFallback>{doctor?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
          </div>
          <div className='flex gap-2'>
            <Image
              src='/assets/icons/calendar.svg'
              width={24}
              height={24}
              alt='calendar'
            />
            <p className='whitespace-nowrap'>
              {formatDateTime(appointment?.schedule).dateTime}
            </p>
          </div>
        </section>
        <Button variant='outline' className='shad-primary-btn' asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
        <p className='copyright'>© 2024 CareTrack.</p>
      </div>
    </div>
  );
}
