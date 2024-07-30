"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export async function createAppointment(data: CreateAppointmentParams) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      data,
    );

    return { status: 200, data: parseStringify(response) };
  } catch (error: any) {
    return error?.message;
  }
}

export async function getAppointment(appointmentId: string) {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
    );
    return parseStringify(appointment);
  } catch (error: any) {
    return error?.message;
  } finally {
    revalidatePath("/admin");
  }
}

export async function getRecentAppointments() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")],
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (response.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCount++;
        } else if (appointment.status === "pending") {
          acc.pendingCount++;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCount++;
        }
        return acc;
      },
      initialCounts,
    );

    const data = {
      totalCount: response.total,
      ...counts,
      documents: response.documents,
    };

    return parseStringify(data);
  } catch (error: any) {
    return error?.message;
  }
}

export async function updateAppointment({
  appointment,
  appointmentId,
  type,
  userId,
}: UpdateAppointmentParams) {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment,
    );

    const smsMessage = `
			Hi, it's caretrack. 
		 	${
        type === "schedule"
          ? `Your appointment has been scheduled for ${
              formatDateTime(appointment.schedule!).dateTime
            } with Dr. ${appointment.primaryPhysician}.`
          : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}.`
      }
			`;

    await sendSmsNotification(userId, smsMessage);
    revalidatePath("/admin");
    return { status: 200, data: parseStringify(response) };
  } catch (error: any) {
    return error?.message;
  }
}

export async function sendSmsNotification(userdId: string, content: string) {
  try {
    const res = await messaging.createSms(ID.unique(), content, [], [userdId]);
    return { status: 200, data: parseStringify(res) };
  } catch (error: any) {
    return error?.message;
  }
}
