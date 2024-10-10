"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { useState } from "react";

const UpdateMap = ({ center, zoom, markerPosition, setMarkerPosition }) => {
  const [position, setPosition] = useState(markerPosition);

  const MapEvents = () => {
    useMapEvents({
      dblclick(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        setMarkerPosition({ lat, lng });
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          Centro Oftalmológico
          <br />
          123-456-7890
        </Popup>
      </Marker>
      <MapEvents />
    </MapContainer>
  );
};

export default UpdateMap;
