import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import './styles.css'

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

const LOCATIONS = [
  {
    name: 'Guwahati',
    address: 'Cotton University, Pan Bazar, 781001',
    coords: [26.187452591989572, 91.74670766665398] as [number, number],
    mapsUrl: 'https://maps.google.com/?q=Cotton+University+Guwahati',
  },
]

export default function Locations() {
  return (
    <>
      <h2 className="section-heading">Where to Find Us.</h2>
      <div className="locations-body">
        <div className="map">
          <MapContainer
            center={[26.187452591989572, 91.74670766665398]}
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