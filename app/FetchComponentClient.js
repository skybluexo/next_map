"use client";
import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function FetchComponentClient() {
  const [drivers, setDrivers] = useState([]);
  useEffect(() => {
    async function getDrivers() {
      try {
        const { data, error } = await supabase.from("test_table").select();
        setDrivers(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    getDrivers();
  }, []);
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
