import { useMemo, useState } from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import type { ViewState } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import GuidedSearch from "../cribs/GuidedSearch";
import { useNavigate } from "react-router";

type Point = {
  id: string;
  name: string;
  img: string;
  price: number;
  lat: number;
  lng: number;
};

const POINTS: Point[] = [
  {
    id: "1",
    name: "Oak Street House",
    img: "https://media.istockphoto.com/id/492965853/photo/university-college-dorm-room-with-bunkbeds-empty-unoccupied-student-bedroom.jpg?s=612x612&w=0&k=20&c=se0Dsy9AwP240fgPs10Fz39uPZR8PgPYn8hiFwhZf58=",
    price: 1200,
    lat: 39.1317,
    lng: -84.5167,
  },
  {
    id: "2",
    name: "Short Vine Apartment",
    img: "https://media.istockphoto.com/id/492965853/photo/university-college-dorm-room-with-bunkbeds-empty-unoccupied-student-bedroom.jpg?s=612x612&w=0&k=20&c=se0Dsy9AwP240fgPs10Fz39uPZR8PgPYn8hiFwhZf58=",
    price: 950,
    lat: 39.1279,
    lng: -84.5146,
  },
  {
    id: "3",
    name: "Campus Edge",
    img: "https://media.istockphoto.com/id/492965853/photo/university-college-dorm-room-with-bunkbeds-empty-unoccupied-student-bedroom.jpg?s=612x612&w=0&k=20&c=se0Dsy9AwP240fgPs10Fz39uPZR8PgPYn8hiFwhZf58=",
    price: 1100,
    lat: 39.1342,
    lng: -84.5201,
  },
];

export default function SimpleMapPage() {
  const [selected, setSelected] = useState<Point | null>(null);
  const [search, setSearch] = useState(false);
  const initialViewState: Partial<ViewState> = useMemo(
    () => ({
      latitude: 39.1317,
      longitude: -84.5167,
      zoom: 14,
    }),
    [],
  );

  return (
    <div className="w-full h-full inset-0 relative">
      <div className="absolute top-5 left-3 z-40">
        <button
          className="bg-white rounded-2xl px-4 py-2"
          onClick={() => setSearch(true)}
        >
          Search
        </button>
      </div>
      <Map
        mapLib={maplibregl}
        initialViewState={initialViewState}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: "100%", height: "100%" }}
      >
        {POINTS.map((p) => (
          <Marker
            key={p.id}
            latitude={p.lat}
            longitude={p.lng}
            anchor="center"
            onClick={(e) => {
              // prevent map click events
              e.originalEvent.stopPropagation();
              setSelected(p);
            }}
          >
            <div
              className="h-4 w-4 rounded-full bg-slate-900 cursor-pointer"
              title={p.name}
            />
          </Marker>
        ))}
      </Map>
      {search && <GuidedSearch setOpenSearch={setSearch} />}
      {selected && <ItemCard point={selected} />}
    </div>
  );
}

const ItemCard = ({ point }: { point: Point }) => {
  const navigate = useNavigate();
  return (
    <div
      className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-40"
      onClick={() => navigate(`/cribs/${point.id}`)}
    >
      <div className="flex items-center gap-4 rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
        {/* Image */}
        <img
          src={point.img}
          alt={point.name}
          className="h-24 w-24 object-cover"
        />

        {/* Text */}
        <div className="flex flex-col justify-center pr-4 min-w-0">
          <h1 className="text-base font-semibold text-slate-900 truncate">
            {point.name}
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            ${point.price.toLocaleString()} / month
          </p>

          {/* Optional meta row */}
          <div className="mt-2 flex gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-2 py-0.5">
              Private room
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5">
              Near campus
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
