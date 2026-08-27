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
    name: 'Jorhat',
    address: 'Ground Floor, Crystal SR Plaza, Gar-Ali, 785001',
    coords: [26.75685008116702, 94.21528058465765] as [number, number],
    mapsUrl: 'https://www.google.com/maps/place/BackThen+Booth,+Jorhat/@26.7566489,94.2153235,17z/data=!3m1!4b1!4m6!3m5!1s0x3746c3293c8441f1:0x21b5714f38b2499a!8m2!3d26.7566489!4d94.2153235!16s%2Fg%2F11zg3krcgt',
  },
  {
    name: 'Dibrugarh',
    address: 'Sir Cafe, KC Gogoi Path, Khaliamari, 786001',
    coords: [27.479610803164846, 94.91832189124382] as [number, number],
    mapsUrl: 'https://www.google.com/maps/place/BackThen+Booth,+Dibrugarh/@27.4790778,94.9122494,16z/data=!4m6!3m5!1s0x374099bd66e2f065:0xd3a5364e74acf853!8m2!3d27.4791825!4d94.9173563!16s%2Fg%2F11zdjfyp1b',
  },
]

export default function Locations() {
  return (
    <>
      <h2 className="section-heading">Where to Find Us.</h2>
      <div className="locations-body">
        <div className="map dark-tiles">
          <MapContainer
            center={getMapCenter(LOCATIONS)}
            zoom={8}
            zoomControl={false}
            attributionControl={false}
            minZoom={8}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
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

function getMapCenter(locations: { coords: [number, number] }[]): [number, number] {
  const [sumLat, sumLng] = locations.reduce(
    ([lat, lng], loc) => [lat + loc.coords[0], lng + loc.coords[1]],
    [0, 0]
  )
  return [sumLat / locations.length, sumLng / locations.length]
}