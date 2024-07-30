import React from "react";
import Image from "next/image";
import Link from "next/link";

import StatCard from "@/components/global/stat-card";
import { getRecentAppointments } from "@/lib/actions/appointment";

import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/columns";

export default async function Admin() {
  const { scheduledCount, pendingCount, cancelledCount, documents } =
    await getRecentAppointments();

  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
      <header className='admin-header'>
        <Link className='cursor-pointer' href='/'>
          <Image
            src='/assets/icons/logo-full.svg'
            alt='logo'
            width={162}
            height={32}
            className='h-8 w-fit'
          />
        </Link>
        <p className='text-16-semibold'>Admin Dashboard </p>
      </header>

      <main className='admin-main'>
        <section className='w-full space-y-4'>
          <h1 className='header'>Welcome 👋</h1>
          <p className='text-dark-700'>
            Start the day with managing new appointments.
          </p>
        </section>

        <section className='admin-stat'>
          <StatCard
            type='appointments'
            count={scheduledCount}
            label='Scheduled appointments'
            icon='/assets/icons/appointments.svg'
          />
          <StatCard
            type='pending'
            count={pendingCount}
            label='Pending appointments'
            icon='/assets/icons/pending.svg'
          />
          <StatCard
            type='cancelled'
            count={cancelledCount}
            label='Cancelled appointments'
            icon='/assets/icons/cancelled.svg'
          />
        </section>

        <DataTable data={documents} columns={columns} />
      </main>
    </div>
  );
}
