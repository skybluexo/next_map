import React from "react";
import DetailMapComponent from "./DetailMapComponent";
import { supabase } from "@/app/lib/supabase";

//Get siggle request
async function getSingleRequest(id) {
  try {
    const { data, error } = await supabase.rpc("get_request_by_id", {
      request_id: id,
    });

    console.log("get_request_by_id:: ", data);
    if (error) throw new Error(error.message);
    else return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

//Get nearby drivers
async function getNearbyDrivers(id, radius) {
  try {
    const { data, error } = await supabase.rpc("get_nearby_drivers", {
      request_id: id,
      radius_meters: radius,
    });

    if (error) throw new Error(error.message);
    else return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

//Get drivers
async function getDrivers() {
  try {
    const { data, error } = await supabase.rpc("fetch_drivers");

    if (error) throw new Error(error.message);
    else return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export default async function ParentDetailComponents(props) {
  const singleRequestData = await getSingleRequest(props.requestId);
  //const driversData = await getDrivers();
  //const nearbyDrivers = await getNearbyDrivers(props.requestId, 10000);
  //console.log(nearbyDrivers);
  //console.log(nearbyDrivers.length);
  return (
    <DetailMapComponent
      singleRequestData={singleRequestData}
      requestId={props.requestId}
      //nearbyDrivers={nearbyDrivers}
    />
  );
}
