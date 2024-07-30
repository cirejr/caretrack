import { StatusIcon } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export default function StatusBadge({
  status,
}: {
  status: "pending" | "scheduled" | "cancelled";
}) {
  return (
    <div
      className={cn("status-badge", {
        "bg-green-600": status === "scheduled",
        "bg-red-600": status === "cancelled",
        "bg-blue-600": status === "pending",
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt={status}
        width={24}
        height={24}
        className='h-fit w-3'
      />
      <p
        className={cn("text-12-semibold capitalize", {
          "text-green-500": status === "scheduled",
          "text-red-500": status === "cancelled",
          "text-blue-500": status === "pending",
        })}
      >
        {status}
      </p>
    </div>
  );
}
