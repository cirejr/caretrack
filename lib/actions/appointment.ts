"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

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
  }
}
