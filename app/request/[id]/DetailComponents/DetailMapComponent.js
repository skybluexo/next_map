"use client";
import React, { useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useState, useRef } from "react";

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
      console.log(props.singleRequestData);
    }
  }, [props.singleRequestData]);

  //Directions Data
  //   const [directionsData, setDirectionsData] = useState(null);

  //   useEffect(() => {
  //     if (
  //       props.searchOriginLatitude !== null &&
  //       props.searchOriginLongitude !== null &&
  //       props.searchDestinationLatitude !== null &&
  //       props.searchDestinationLongitude !== null
  //     ) {
  //       //using the directions API

  //       const requestOrigin = {
  //         lat: props.searchOriginLatitude,
  //         lng: props.searchOriginLongitude,
  //       };

  //       const requestDestination = {
  //         lat: props.searchDestinationLatitude,
  //         lng: props.searchDestinationLongitude,
  //       };

  //       const directionsService = new google.maps.DirectionsService();
  //       directionsService.route(
  //         {
  //           origin: requestOrigin,
  //           destination: requestDestination,
  //           travelMode: window.google.maps.TravelMode.DRIVING,
  //         },
  //         (result) => {
  //           console.log(result);
  //           setDirectionsData(result);
  //         }
  //       );
  //     }
  //   }, [
  //     props.searchOriginLatitude,
  //     props.searchOriginLongitude,
  //     props.searchDestinationLatitude,
  //     props.searchDestinationLongitude,
  //   ]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      options={options}
      center={center}
      zoom={13}
      //onClick={() => setIsInfoWindowOpen(false)}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {/* Child components, such as markers, info windows, etc. */}
      {/* {props.searchOriginLatitude !== null &&
        props.searchOriginLongitude !== null && (
          <MarkerF
            position={{
              lat: props.searchOriginLatitude,
              lng: props.searchOriginLongitude,
            }}
          ></MarkerF>
        )} */}

      {/*Direction renderer*/}
      {/* {directionsData && (
        <DirectionsRenderer
          directions={directionsData}
          options={{ polylineOptions: { strokeColor: "red", strokeWeight: 4 } }}
        />
      )} */}

      <></>
    </GoogleMap>
  ) : (
    <></>
  );
}
