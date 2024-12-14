import React from "react";
import DetailMapComponent from "./DetailMapComponent";
import { supabase } from "@/app/lib/supabase";

async function getSingleRequest(id) {
  try {
    const { data, error } = await supabase
      .from("requests")
      .select()
      .eq("id", id);
    if (error) throw new Error(error.message);
    else return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export default async function ParentDetailComponents(props) {
  const singleRequestData = await getSingleRequest(props.requestId);
  console.log(singleRequestData);
  return <DetailMapComponent singleRequestData={singleRequestData} />;
}
