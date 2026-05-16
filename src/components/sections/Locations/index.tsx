import 'leaflet/dist/leaflet.css'
import './styles.css'
import { MapContainer } from 'react-leaflet'
import { TileLayer } from 'react-leaflet'
import { Marker } from 'react-leaflet'

const LOCATIONS = [
  {
    name: 'Guwahati',
    address: 'Royal Global University, Betkuchi, 781035',
    coords: [26.112237189801707, 91.72418962544246] as [number, number],
    mapsUrl: 'https://maps.google.com/?q=Royal+Global+University+Guwahati',
  },
]

export default function Locations() {
  return (
    <>
      <h2 className="section-heading">Where to Find Us.</h2>
      <div className="locations-body">
        <div className="map">
          <MapContainer
            center={[26.2318, 91.7891]}
            zoom={8}
            zoomControl={false}
            attributionControl={false}
            minZoom={8}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png" />
            {LOCATIONS.map((loc) => (
              <Marker key={loc.name} position={loc.coords} />
            ))}
          </MapContainer>
        </div>
        <div className="locations-list">
          {LOCATIONS.map((loc) => (
            <div key={loc.name} className="location-item">
              <div className="location-name">{loc.name}</div>
              <div className="location-address">{loc.address}</div>
              <a
                className="location-directions"
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>get directions</span> ↗
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}