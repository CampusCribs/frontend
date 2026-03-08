import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertCircle,
  Clock,
  MapPin,
  Search,
  CircleX,
  SearchX,
  Footprints,
  Car,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";

import Lottie from "lottie-react";
import house from "@/components/ui/houseanimation.json";
import GuidedSearch from "./GuidedSearch";

import { ResidenceCardDTO } from "@/gen/types/ResidenceCardDTO";
import { useGetAppCribs } from "@/gen";

/** ---------- helpers ---------- */

function formatAvailability(a: any): string {
  // Matches your OpenAPI discriminator style: { type: "IMMEDIATE" } or { type: "DATE", date: "YYYY-MM-DD" }
  if (!a || !a.type) return "Unknown";
  if (a.type === "IMMEDIATE") return "now";
  if (a.type === "DATE" && a.date) return a.date;
  return "Unknown";
}

function commuteText(
  distance?: number,
  commuteBucket?: string | null,
): string | null {
  // Prefer explicit bucket if you have it (nice for UI consistency)
  if (commuteBucket) {
    switch (commuteBucket) {
      case "WALK_5":
        return "5 min walk to campus";
      case "WALK_10":
        return "10 min walk to campus";
      case "WALK_15":
        return "15 min walk to campus";
      case "WALK_20":
        return "20 min walk to campus";
      case "DRIVE":
        return "Short drive to campus";
      default:
        break;
    }
  }

  // Fall back to distance minutes if provided
  if (
    typeof distance === "number" &&
    Number.isFinite(distance) &&
    distance > 0
  ) {
    if (distance <= 20) return `${distance} min walk to campus`;
    return `${distance} min drive to campus`;
  }

  return null;
}

function isWalk(distance?: number, commuteBucket?: string | null): boolean {
  if (commuteBucket) return commuteBucket.startsWith("WALK_");
  if (typeof distance === "number") return distance <= 20;
  return true;
}

/** ---------- Card ---------- */

export function ResidenceCard({ data }: { data: ResidenceCardDTO }) {
  const navigate = useNavigate();

  const isVerified = data.verification === "VERIFIED";
  const verificationClasses = isVerified
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-gray-100 text-gray-600 ring-gray-200";

  const locationLabel = useMemo(() => {
    return data.areaLabel?.trim()
      ? `${data.campusName} • ${data.areaLabel.trim()}`
      : data.campusName;
  }, [data.campusName, data.areaLabel]);

  const commuteLabel = useMemo(
    () => commuteText(data.distance, (data as any).commuteBucket ?? null),
    [data.distance, (data as any).commuteBucket],
  );

  const showWalk = useMemo(
    () => isWalk(data.distance, (data as any).commuteBucket ?? null),
    [data.distance, (data as any).commuteBucket],
  );

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
                Available {formatAvailability((data as any).availability)}
              </span>
            </div>
          </div>

          {/* Distance row */}
          <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
            {commuteLabel ? (
              <span className="flex items-center gap-1">
                {showWalk ? (
                  <Footprints size={16} className="text-gray-500" />
                ) : (
                  <Car size={16} className="text-gray-500" />
                )}
                {commuteLabel}
              </span>
            ) : (
              <span className="text-gray-500">Commute not provided</span>
            )}
          </div>

          <div className="pt-1">
            <span
              className={[
                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                verificationClasses,
              ].join(" ")}
              title={
                isVerified
                  ? "This user completed verification."
                  : "This user has not completed verification yet."
              }
            >
              {isVerified ? (
                <CheckCircle2 size={12} />
              ) : (
                <AlertCircle size={12} />
              )}
              {isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

/** ---------- Page ---------- */

type PageResponse<T> = {
  content: T[];
  number: number; // current page index
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

export default function CribsPage() {
  const [openSearch, setOpenSearch] = useState(false);

  const [items, setItems] = useState<ResidenceCardDTO[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { ref, inView } = useInView({ threshold: 0 });

  /**
   * IMPORTANT:
   * Your generated hook signature may differ depending on your OpenAPI generator.
   * Most common patterns are one of these:
   *
   * 1) useGetAppCribs({ page, size })
   * 2) useGetAppCribs({ query: { page, size } })
   * 3) useGetAppCribs({ page, size }, { enabled: true })
   *
   * Adjust the call below to match your generated client.
   */
  const {
    data,
    isLoading: isLoadingCribs,
    error,
    isFetching,
  } = useGetAppCribs(
    // ✅ try this first:
    { page, size: pageSize } as any,
  );
  console.log("API response", { data, error });
  const pageData = data?.data as unknown as
    | PageResponse<ResidenceCardDTO>
    | undefined;

  // When a page arrives, append it (or replace if it's page 0)
  useEffect(() => {
    if (!pageData) return;

    setItems((prev) => {
      if (pageData.number === 0) return pageData.content ?? [];
      // append while preventing duplicates (just in case)
      const seen = new Set(prev.map((x) => x.id));
      const merged = [...prev];
      for (const c of pageData.content ?? []) {
        if (!seen.has(c.id)) merged.push(c);
      }
      return merged;
    });
  }, [pageData?.number, pageData?.content]);

  // Infinite scroll: when sentinel is visible, move to next page (if not last)
  useEffect(() => {
    if (!inView) return;
    if (isLoadingCribs || isFetching) return;
    if (!pageData) return;
    if (pageData.last) return;

    setPage((p) => p + 1);
  }, [inView, isLoadingCribs, isFetching, pageData?.last]);

  // Decide UI status
  const status: "loading" | "ready" | "empty" | "error" = useMemo(() => {
    if (error) return "error";
    if (isLoadingCribs && items.length === 0) return "loading";
    if (!isLoadingCribs && items.length === 0) return "empty";
    return "ready";
  }, [error, isLoadingCribs, items.length]);

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
            {!pageData?.last && <div ref={ref} className="h-10" />}

            {/* optional small loader when fetching next page */}
            {isFetching && (
              <div className="w-full flex justify-center py-3 text-sm text-black/60">
                Loading more...
              </div>
            )}
          </>
        )}
      </div>

      {openSearch && <GuidedSearch setOpenSearch={setOpenSearch} />}
    </div>
  );
}
