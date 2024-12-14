import React from "react";
import { supabase } from "./lib/supabase";

async function getDrivers() {
  try {
    const { data, error } = await supabase.from("test_table").select();
    if (error) throw new Error(error.message);
    else return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export default async function FetchComponentServer() {
  const drivers = await getDrivers();
  return (
    <div>
      {drivers.map((driver) => (
        <div key={driver.id}>
          <h5>
            Name: {driver.name} *** Distance: {driver.distance}
          </h5>
        </div>
      ))}
    </div>
  );
}
