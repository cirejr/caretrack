import Image from "next/image";
import * as Sentry from "@sentry/nextjs";

import AppointmentForm from "@/components/forms/appointment-form";
import { getPatient } from "@/lib/actions/patient";

export default async function NewAppointment({
  params: { userId },
}: SearchParamProps) {
  const patient = await getPatient(userId);
  Sentry.metrics.set("user_view_new-appointment", patient?.name);

  return (
    <div className='flex h-screen max-h-screen'>
      <section className='remove-scrollbar container my-auto'>
        <div className='sub-container max-w-[860px] flex-1 justify-between'>
          <Image
            src='/assets/icons/logo-full.svg'
            alt='patient'
            width={1000}
            height={1000}
            className='mb-12 h-10 w-fit'
          />

          <AppointmentForm
            type='create'
            userId={userId}
            patientId={patient?.$id}
          />

          <p className='copyright mt-10 py-12'>© 2024 CareTrack.</p>
        </div>
      </section>
      <Image
        src='/assets/images/appointment-img.png'
        width={1000}
        height={1000}
        alt='appointment'
        className='side-img max-w-[396px] bg-bottom'
      />
    </div>
  );
}
