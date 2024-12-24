"use client";
import React, { useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
  DirectionsRenderer,
  PolylineF,
} from "@react-google-maps/api";
import { useState, useRef } from "react";
import { supabase } from "@/app/lib/supabase";
import StarRating from "./StarRating";
import polyline from "@mapbox/polyline";

export default function DetailMapComponent(props) {
  const containerStyle = {
    width: "100%",
    height: "90vh",
  };

  const options = {
    mapId: "6b1f5fd010089d3b",
    mapTypeControl: false,
    zoomControl: false,
    fullscreenControl: false,
    clicableIcons: false,
    scrollwheel: true,
    streetViewControl: false,
  };

  const center = {
    lat: 51.507491418998285,
    lng: -0.12425795200807187,
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);

  useEffect(() => {
    if (props.singleRequestData) {
      console.log("props.singleRequestData: ", props.singleRequestData);
    } else {
      console.log("props.singleRequestData: No data");
    }
  }, [props.singleRequestData]);

  //testnow .origin .destination
  const matchOrigin = props.singleRequestData[0].origin_wkt.match(
    /POINT\(([^ ]+) ([^ ]+)\)/
  );
  const matchDestination = props.singleRequestData[0].destination_wkt.match(
    /POINT\(([^ ]+) ([^ ]+)\)/
  );

  const originLatitude = parseFloat(matchOrigin[2]);
  const originLongitude = parseFloat(matchOrigin[1]);

  const destinationLatitude = parseFloat(matchDestination[2]);
  const destinationLongitude = parseFloat(matchDestination[1]);

  const [clickedMarker, setClickedMarker] = useState(null);

  //Input data
  const [radiusValue, setRadiusValue] = useState(5000);
  //Drivers data
  const [nearbyDrivers, setNearbyDrivers] = useState([]);

  //Directions Data
  const [directionsData, setDirectionsData] = useState(null);
  const [directionsDriver, setDirectionsDriver] = useState(null);
  const [clickedMarkerCoordinates, setClickedMarkerCoordinates] =
    useState(null);
  const [driverPolyline, setDriverPolyline] = useState(null);
  const [driverDistance, setDriverDistance] = useState(null);
  const [driverDuration, setDriverDuration] = useState(null);

  //Request directions
  useEffect(() => {
    if (
      originLatitude !== null &&
      originLongitude !== null &&
      destinationLatitude !== null &&
      destinationLongitude !== null
    ) {
      //using the directions API
      const requestOrigin = {
        lat: originLatitude,
        lng: originLongitude,
      };

      const requestDestination = {
        lat: destinationLatitude,
        lng: destinationLongitude,
      };

      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: requestOrigin,
          destination: requestDestination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result) => {
          console.log(result);
          setDirectionsData(result);
        }
      );
    }
  }, [
    originLatitude,
    originLongitude,
    destinationLatitude,
    destinationLongitude,
  ]);

  //Drivers directions
  useEffect(() => {
    if (
      originLatitude !== null &&
      originLongitude !== null &&
      clickedMarkerCoordinates
    ) {
      //using the directions API

      const requestOrigin = {
        lat: originLatitude,
        lng: originLongitude,
      };

      const driverPosition = {
        lat: clickedMarkerCoordinates.lat,
        lng: clickedMarkerCoordinates.lng,
      };

      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: requestOrigin,
          destination: driverPosition,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result) => {
          console.log(result);
          setDirectionsDriver(result);
          setDriverPolyline(
            polyline.decode(result.routes[0].overview_polyline)
          );
          setDriverDistance(result.routes[0].legs[0].distance.text);
          setDriverDuration(result.routes[0].legs[0].duration.text);
        }
      );
    }
  }, [originLatitude, originLongitude, clickedMarkerCoordinates]);

  //Function to convert to array of objects
  function convertToArrayOfObjects(arrayOfArrays) {
    const coordinates = arrayOfArrays.map((coord) => {
      return { lat: coord[0], lng: coord[1] };
    });
    return coordinates;
  }

  const [convertedPolyline, setConvertedPolyline] = useState(null);

  //Viewing the overview polyline
  useEffect(() => {
    if (driverPolyline) {
      setConvertedPolyline(convertToArrayOfObjects(driverPolyline));
    }
  }, [driverPolyline]);

  const extractCoordinates = (str) => {
    const regex = /POINT\((-?\d+\.\d+)\s(-?\d+\.\d+)\)/;
    const matches = str.match(regex);

    if (matches && matches.length === 3) {
      const [, coordTwo, coordOne] = matches;
      return {
        coordTwo: parseFloat(coordTwo),
        coordOne: parseFloat(coordOne),
      };
    }
    return null;
  };

  const carIcon = {
    url: "/assets/car.png",
    scaledSize: { width: 40, height: 50 },
  };

  useEffect(() => {
    if (props.requestId && radiusValue !== "") {
      async function getNearbyDrivers() {
        try {
          const { data, error } = await supabase.rpc("get_nearby_drivers", {
            request_id: props.requestId,
            radius_meters: radiusValue,
          });

          if (error) throw new Error(error.message);
          else {
            console.log(data);
            setNearbyDrivers(data);
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }

      getNearbyDrivers();
    }
  }, [props.requestId, radiusValue]);

  //Handling marker click
  function handleClickedMarker(id, coords) {
    if (id === clickedMarker) {
      return; //do nothing
    } else {
      setClickedMarker(id);
      setClickedMarkerCoordinates(coords);
    }
  }

  return isLoaded ? (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        options={options}
        center={center}
        zoom={13}
        onClick={() => setClickedMarker(false)}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {/* Child components, such as markers, info windows, etc. */}
        {/* Origin Marker */}
        {originLatitude !== null && originLongitude !== null && (
          <MarkerF
            position={{
              lat: originLatitude,
              lng: originLongitude,
            }}
          ></MarkerF>
        )}
        {/* Destination Marker */}
        {destinationLatitude !== null && destinationLongitude !== null && (
          <MarkerF
            position={{
              lat: destinationLatitude,
              lng: destinationLongitude,
            }}
          ></MarkerF>
        )}

        {/*Direction renderer for request*/}
        {directionsData && (
          <DirectionsRenderer
            directions={directionsData}
            options={{
              polylineOptions: { strokeColor: "red", strokeWeight: 4 },
            }}
          />
        )}

        {/*Direction renderer for drivers*/}
        {/* {directionsDriver && (
          <DirectionsRenderer
            directions={directionsDriver}
            options={{
              polylineOptions: { strokeColor: "blue", strokeWeight: 5 },
            }}
          />
        )} */}
        <PolylineF
          path={convertedPolyline}
          options={{
            strokeColor: "blue",
            strokeWeight: 10,
          }}
        />

        {/* Displaying the drivers as markers */}
        {nearbyDrivers.map((driver) => {
          const coordinates = extractCoordinates(driver.driver_position); //testnow driver_location
          return (
            <MarkerF
              key={driver.id}
              position={{
                lat: coordinates.coordOne,
                lng: coordinates.coordTwo,
              }}
              icon={carIcon}
              onClick={() => {
                handleClickedMarker(driver.id, {
                  lat: coordinates.coordOne,
                  lng: coordinates.coordTwo,
                });
              }}
            >
              {clickedMarker === driver.id && (
                <InfoWindowF
                  position={{
                    lat: coordinates.coordOne,
                    lng: coordinates.coordTwo,
                  }}
                >
                  <div className="w-80 p-2">
                    <div className="flex items-center mb-2 space-x-5">
                      <img
                        src="https://images.unsplash.com/photo-1696928634052-41aa345ef686?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        className="w-14 h-14 rounded-full"
                      />
                      <div>
                        <h3 className="text-xl font-bold">
                          {driver.driver_username}
                        </h3>
                        <p>{driver.driver_rating}</p>
                        <StarRating rating={driver.driver_rating} />
                      </div>
                    </div>
                    <p>
                      <span className="font-bold">{driverDistance} </span>
                      away
                    </p>
                    <p>
                      Will be here in{" "}
                      <span className="font-bold">{driverDuration}</span>
                    </p>
                  </div>
                </InfoWindowF>
              )}
            </MarkerF>
          );
        })}

        <></>
      </GoogleMap>
      <div className="flex space-x-2 items-center absolute top-1 left-5 w-1/2 h-10">
        <input
          placeholder="enter radius (meters)"
          type="number"
          className="w-1/2 h-full p-2 bg-black text-white"
          value={radiusValue}
          onChange={(e) => setRadiusValue(e.target.value)}
        />
        <button className="bg-blue-500 px-4 py-2 text-white font-bold rounded-full">
          {nearbyDrivers.length} drivers
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}
