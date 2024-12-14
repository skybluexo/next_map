import React from "react";
import ParentDetailComponents from "./DetailComponents/ParentDetailComponents";

export const metadata = {
  title: "Trip Details | Next course",
  description:
    "More information about your trip request | Connect with a driver",
};

export default function RequestDetail({ params }) {
  console.log(params);
  const requestId = params.id;
  return <ParentDetailComponents requestId={requestId} />;
}
