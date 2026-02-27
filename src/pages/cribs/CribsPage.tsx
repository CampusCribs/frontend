import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Search,
  CircleX,
  SearchX,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";

import Lottie from "lottie-react";
import house from "@/components/ui/houseanimation.json";
import GuidedSearch from "./GuidedSearch";

type CommuteBucket =
  | "WALK_LT_5"
  | "WALK_5_15"
  | "WALK_15_30"
  | "DRIVE_LT_20"
  | "DRIVE_GT_20"
  | null
  | undefined;

function formatCommute(bucket: CommuteBucket) {
  switch (bucket) {
    case "WALK_LT_5":
      return "< 5 min walk";
    case "WALK_5_15":
      return "5–15 min walk";
    case "WALK_15_30":
      return "15–30 min walk";
    case "DRIVE_LT_20":
      return "< 20 min drive";
    case "DRIVE_GT_20":
      return "> 20 min drive";
    default:
      return null;
  }
}

type Availability = { type: "Immediate" } | { type: "Date"; date: string }; // ISO date

function formatAvailability(a: Availability) {
  if (a.type === "Immediate") return "Immediate";
  const d = new Date(a.date);
  if (Number.isNaN(d.getTime())) return a.date;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Student-only DTO for this MVP page
export type StudentResidenceCardDTO = {
  id: string;
  thumbnailUrl: string;

  priceMonthly: number;
  availability: Availability;

  campusName: string;
  areaLabel?: string | null;
  commuteBucket?: CommuteBucket;

  identity: {
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
  };

  verification: "VERIFIED" | "UNVERIFIED" | "PENDING";

  beds?: number;
  baths?: number;
};

/** ----- Fake Data ----- */
function seeded<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

function makeFakeCrib(i: number): StudentResidenceCardDTO {
  const campuses = [
    "University of Cincinnati",
    "Ohio State University",
    "NYU",
    "Purdue University",
    "University of Michigan",
  ];

  const areas = [
    "Near campus",
    "Downtown",
    "Clifton",
    "Off-campus housing",
    "Short walk to campus",
    "Near shuttle stop",
    null,
  ];

  const commutes: CommuteBucket[] = [
    "WALK_LT_5",
    "WALK_5_15",
    "WALK_15_30",
    "DRIVE_LT_20",
    "DRIVE_GT_20",
    null,
  ];

  const people = [
    { username: "avak", firstName: "Ava", lastName: "Khan" },
    { username: "samr", firstName: "Sam", lastName: "Reed" },
    { username: "jordanp", firstName: "Jordan", lastName: "Patel" },
    { username: "miaw", firstName: "Mia", lastName: "Wong" },
    { username: "noahs", firstName: "Noah", lastName: "Smith" },
  ];

  const thumbs = [
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70",
  ];

  const verifications: StudentResidenceCardDTO["verification"][] = [
    "VERIFIED",
    "UNVERIFIED",
    "PENDING",
  ];

  const availability: Availability =
    i % 4 === 0
      ? { type: "Immediate" }
      : {
          type: "Date",
          date: new Date(
            Date.now() + (i + 10) * 24 * 60 * 60 * 1000,
          ).toISOString(),
        };

  const person = seeded(people, i);
  const campusName = seeded(campuses, i);
  const commuteBucket = seeded(commutes, i);
  const areaLabel = seeded(areas, i);

  return {
    id: `fake-${i}`,
    thumbnailUrl: seeded(thumbs, i),
    priceMonthly: 650 + (i % 10) * 75,
    availability,
    campusName,
    areaLabel,
    commuteBucket,
    identity: {
      ...person,
      avatarUrl: null,
    },
    verification: seeded(verifications, i),
    beds: 1 + (i % 3),
    baths: 1 + (i % 2),
  };
}

function buildFakePage(offset: number, size: number) {
  return Array.from({ length: size }, (_, k) => makeFakeCrib(offset + k));
}

/** ----- Card ----- */
export function ResidenceCard({ data }: { data: StudentResidenceCardDTO }) {
  const navigate = useNavigate();

  const isVerified = data.verification === "VERIFIED";
  const verificationClasses = isVerified
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-gray-100 text-gray-600 ring-gray-200";

  const displayName = useMemo(() => {
    const first = data.identity.firstName?.trim() ?? "";
    const last = data.identity.lastName?.trim() ?? "";
    const name = `${first} ${last}`.trim();
    return name || `@${data.identity.username}`;
  }, [data.identity.firstName, data.identity.lastName, data.identity.username]);

  const locationLabel = useMemo(() => {
    return data.areaLabel?.trim()
      ? `${data.campusName} • ${data.areaLabel.trim()}`
      : data.campusName;
  }, [data.campusName, data.areaLabel]);

  const commuteLabel = formatCommute(data.commuteBucket);

  return (
    <Card
      onClick={() => navigate(`/cribs/${data.id}`)}
      className="cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition"
    >
      <CardContent className="p-0 relative">
        <img
          src={data.thumbnailUrl}
          alt="Residence"
          className="h-44 w-full object-cover"
          loading="lazy"
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-white text-sm font-semibold truncate">
              <MapPin size={14} />
              <span className="truncate">{locationLabel}</span>
            </div>

            {commuteLabel ? (
              <div className="mt-0.5 text-white/90 text-xs font-medium truncate">
                {commuteLabel}
              </div>
            ) : (
              <div className="mt-0.5 text-white/90 text-xs font-medium">
                Tap to view details
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-3 py-3">
        <div className="w-full space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="text-base font-semibold text-gray-900 leading-tight">
              ${data.priceMonthly}{" "}
              <span className="text-xs font-medium text-gray-500">/ mo</span>
            </div>

            <div className="shrink-0 text-xs font-medium text-gray-600">
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 ring-1 ring-inset ring-gray-200">
                <Clock size={12} />
                Available {formatAvailability(data.availability)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
            <span>{data.beds} Bed</span>
            <span className="text-gray-400">•</span>
            <span>{data.baths} Bath</span>
          </div>
          <div className="pt-1">
            <span
              className={[
                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                verificationClasses,
              ].join(" ")}
              title={
                isVerified
                  ? "This student completed verification."
                  : "This student has not completed verification yet."
              }
            >
              {isVerified ? (
                <CheckCircle2 size={12} />
              ) : (
                <AlertCircle size={12} />
              )}
              {data.verification === "VERIFIED"
                ? "Verified student"
                : "Unverified"}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

/** ----- Page ----- */
export default function CribsPage() {
  const [openSearch, setOpenSearch] = useState(false);

  // Fake “infinite” list state
  const [items, setItems] = useState<StudentResidenceCardDTO[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error">(
    "loading",
  );

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { ref, inView } = useInView({ threshold: 0 });

  // initial load
  useEffect(() => {
    setStatus("loading");
    const t = setTimeout(() => {
      const first = buildFakePage(0, pageSize * 2); // load a bit more initially
      setItems(first);
      setStatus(first.length ? "ready" : "empty");
      setPage(1);
    }, 450);

    return () => clearTimeout(t);
  }, []);

  // load more when sentinel enters view
  useEffect(() => {
    if (!inView) return;
    if (status !== "ready") return;

    const t = setTimeout(() => {
      const next = buildFakePage(page * pageSize * 2, pageSize);
      setItems((prev) => [...prev, ...next]);
      setPage((p) => p + 1);
    }, 250);

    return () => clearTimeout(t);
  }, [inView, page, status]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search opener */}
      <div className="flex w-full p-2 justify-center items-center">
        <div
          className="shadow-sm px-5 py-3 rounded-2xl flex justify-center items-center bg-white border border-black/10 font-semibold text-black/70 cursor-pointer w-full max-w-md"
          onClick={() => setOpenSearch(!openSearch)}
        >
          <Search className="mr-2 text-black/70" />
          Start your search
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        {status === "loading" && (
          <div className="flex w-full h-[400px] justify-center items-center">
            <div className="flex flex-col items-center justify-center">
              <Lottie
                animationData={house}
                loop
                autoplay
                style={{ width: 200, height: 200 }}
              />
              <div className="text-black/70">loading...</div>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex w-full h-[400px] justify-center items-center">
            <div className="flex flex-col items-center">
              <div className="flex justify-center mb-4">
                <CircleX size={82} />
              </div>
              <div className="text-black/70">An error occurred</div>
            </div>
          </div>
        )}

        {status === "empty" && (
          <div className="flex w-full h-[400px] justify-center items-center">
            <div className="flex flex-col items-center">
              <div className="flex justify-center mb-4">
                <SearchX size={82} />
              </div>
              <div className="text-black/70">No residences found</div>
            </div>
          </div>
        )}

        {status === "ready" && (
          <>
            <div className="grid grid-cols-2 gap-1 w-full p-2">
              {items.map((crib) => (
                <ResidenceCard key={crib.id} data={crib} />
              ))}
            </div>

            {/* infinite scroll sentinel */}
            <div ref={ref} className="h-10" />
          </>
        )}
      </div>

      {openSearch && <GuidedSearch setOpenSearch={setOpenSearch} />}
    </div>
  );
}
