"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const Map = ({ center, zoom }) => (
  <MapContainer
    center={center}
    zoom={zoom}
    style={{ height: '400px', width: '100%' }}
  >
    <TileLayer
      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <Marker position={center}>
      <Popup>
        Centro Oftalmológico
        <br />
        123-456-7890
      </Popup>
    </Marker>
  </MapContainer>
);

export default Map;
