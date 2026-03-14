import { ReminderModal } from "@/components/modals/ReminderModal";
import house from "@/components/ui/houseanimation.json";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useGetAppCribs } from "@/gen";
import type { ResidenceCardDTO } from "@/gen/types/ResidenceCardDTO";
import Lottie from "lottie-react";
import {
  AlertCircle,
  Car,
  CheckCircle2,
  CircleX,
  Clock,
  Footprints,
  MapPin,
  Search,
  SearchX,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";
import GuidedSearch from "./GuidedSearch";

import type { GetAppCribsQueryParamsCommuteBucketEnum } from "@/gen";
import {
  type AppliedCribSearch,
  getReminderSummaryLines,
} from "./search-reminder";

function formatAvailability(a: any): string {
  if (!a || !a.type) return "Unknown";
  if (a.type === "IMMEDIATE") return "now";
  if (a.type === "DATE" && a.date) return a.date;
  return "Unknown";
}

function commuteText(
  distance?: number,
  commuteBucket?: string | null,
): string | null {
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

export function ResidenceCard({ data }: { data: ResidenceCardDTO }) {
  const navigate = useNavigate();

  const isVerified = data.verification === "VERIFIED";
  const verificationClasses = isVerified
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-gray-100 text-gray-600 ring-gray-200";

  const locationLabel = useMemo(() => {
    return data.areaLabel?.trim()
      ? `${data.campusName} · ${data.areaLabel.trim()}`
      : data.campusName;
  }, [data.areaLabel, data.campusName]);

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
      className="cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
    >
      <CardContent className="relative p-0">
        <img
          src={data.thumbnailUrl}
          alt="Residence"
          className="h-44 w-full object-cover"
          loading="lazy"
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1 truncate text-sm font-semibold text-white">
              <MapPin size={14} />
              <span className="truncate">{locationLabel}</span>
            </div>

            {commuteLabel ? (
              <div className="mt-0.5 truncate text-xs font-medium text-white/90">
                {commuteLabel}
              </div>
            ) : (
              <div className="mt-0.5 text-xs font-medium text-white/90">
                Tap to view details
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-3 py-3">
        <div className="w-full space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="text-base font-semibold leading-tight text-gray-900">
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

type PageResponse<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

const defaultAppliedSearch: AppliedCribSearch = {
  campus: "",
  locationQuery: "",
  minPrice: 500,
  maxPrice: 1500,
  listingType: "sublease",
  roomType: "any",
  leaseTerm: "any",
  moveInWindow: "any",
  beginDate: "",
  endDate: "",
  commuteBucket: "",
  roommates: 0,
  tagIds: [],
  tagNames: [],
  filterKeys: [],
};

export default function CribsPage() {
  const [openSearch, setOpenSearch] = useState(false);
  const [openReminder, setOpenReminder] = useState(false);
  const [reminderCreated, setReminderCreated] = useState(false);
  const [appliedSearch, setAppliedSearch] =
    useState<AppliedCribSearch>(defaultAppliedSearch);
  const [items, setItems] = useState<ResidenceCardDTO[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { ref, inView } = useInView({ threshold: 0 });

  const cribParams = useMemo(
    () => {
      const params: Record<string, unknown> = {
        page,
        size: pageSize,
        minPrice: appliedSearch.minPrice,
        maxPrice: appliedSearch.maxPrice,
      };

      if (appliedSearch.campus) params.campus = appliedSearch.campus;
      if (appliedSearch.locationQuery) {
        params.locationQuery = appliedSearch.locationQuery;
      }
      if (appliedSearch.listingType !== "sublease") {
        params.listingType = appliedSearch.listingType;
      }
      if (appliedSearch.roomType !== "any") {
        params.roomType = appliedSearch.roomType;
      }
      if (appliedSearch.leaseTerm !== "any") {
        params.leaseTerm = appliedSearch.leaseTerm;
      }
      if (appliedSearch.moveInWindow !== "any") {
        params.moveInWindow = appliedSearch.moveInWindow;
      }
      if (appliedSearch.beginDate) params.beginDate = appliedSearch.beginDate;
      if (appliedSearch.endDate) params.endDate = appliedSearch.endDate;
      if (appliedSearch.commuteBucket) {
        params.commuteBucket =
          appliedSearch.commuteBucket as GetAppCribsQueryParamsCommuteBucketEnum;
      }
      if (appliedSearch.roommates > 0) {
        params.roommates = appliedSearch.roommates;
      }
      if (appliedSearch.tagIds.length > 0) {
        params.tagIds = appliedSearch.tagIds;
      }
      if (appliedSearch.filterKeys.length > 0) {
        params.filterKeys = appliedSearch.filterKeys;
      }

      return params;
    },
    [appliedSearch, page],
  );

  const {
    data,
    isLoading: isLoadingCribs,
    error,
    isFetching,
  } = useGetAppCribs(cribParams);

  const pageData = data?.data as PageResponse<ResidenceCardDTO> | undefined;

  useEffect(() => {
    if (!pageData) return;

    setItems((prev) => {
      if (pageData.number === 0) return pageData.content ?? [];

      const seen = new Set(prev.map((x) => x.id));
      const merged = [...prev];
      for (const crib of pageData.content ?? []) {
        if (!seen.has(crib.id)) merged.push(crib);
      }
      return merged;
    });
  }, [pageData?.content, pageData?.number]);

  useEffect(() => {
    if (!inView) return;
    if (isLoadingCribs || isFetching) return;
    if (!pageData || pageData.last) return;

    setPage((current) => current + 1);
  }, [inView, isFetching, isLoadingCribs, pageData]);

  const status: "loading" | "ready" | "empty" | "error" = useMemo(() => {
    if (error) return "error";
    if (isLoadingCribs && items.length === 0) return "loading";
    if (!isLoadingCribs && items.length === 0) return "empty";
    return "ready";
  }, [error, isLoadingCribs, items.length]);

  const reminderSummary = useMemo(
    () => getReminderSummaryLines(appliedSearch),
    [appliedSearch],
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-full items-center justify-center p-3">
        <button
          type="button"
          className="w-full max-w-md rounded-[24px] border border-neutral-200 bg-white px-4 py-3 shadow-sm transition hover:shadow-md"
          onClick={() => setOpenSearch(!openSearch)}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-neutral-100 p-2.5 text-neutral-700">
              <Search className="h-4.5 w-4.5" />
            </div>
            <div className="text-lg font-semibold text-neutral-900">Search</div>
          </div>
        </button>
      </div>

      <div className="w-full">
        {status === "loading" && (
          <div className="flex h-[400px] w-full items-center justify-center">
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
          <div className="flex h-[400px] w-full items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex justify-center">
                <CircleX size={82} />
              </div>
              <div className="text-black/70">An error occurred</div>
            </div>
          </div>
        )}

        {status === "empty" && (
          <div className="flex h-[400px] w-full items-center justify-center">
            <div className="flex max-w-sm flex-col items-center px-5 text-center">
              <div className="mb-4 flex justify-center">
                <SearchX size={82} />
              </div>
              <div className="text-black/70">No residences found</div>
              <div className="mt-2 text-sm text-black/55">
                We can notify you when a crib matches these current filters.
              </div>
              <div className="mt-4 w-full rounded-2xl border border-neutral-200 bg-white p-4 text-left">
                <div className="text-sm font-semibold text-neutral-900">
                  Current filters
                </div>
                <div className="mt-3 space-y-2">
                  {reminderSummary.map((line) => (
                    <div key={line} className="text-sm text-neutral-600">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpenReminder(true)}
                className="mt-4 rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white"
              >
                Set reminder
              </button>
            </div>
          </div>
        )}

        {status === "ready" && (
          <>
            <div className="grid w-full grid-cols-2 gap-1 p-2">
              {items.map((crib) => (
                <ResidenceCard key={crib.id} data={crib} />
              ))}
            </div>

            {!pageData?.last && <div ref={ref} className="h-10" />}

            {isFetching && (
              <div className="flex w-full justify-center py-3 text-sm text-black/60">
                Loading more...
              </div>
            )}

            {pageData?.last && items.length > 0 && (
              <div className="px-3 pb-6 pt-2">
                <div className="rounded-[28px] border border-neutral-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">
                        You reached the end of current matches
                      </div>
                      <div className="mt-1 text-sm text-neutral-500">
                        We can notify you when new cribs match these filters.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenReminder(true)}
                      className="rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
                    >
                      Set notification
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {reminderCreated && (
        <div className="px-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Reminder created for your current crib filters.
          </div>
        </div>
      )}

      {openSearch && (
        <GuidedSearch
          setOpenSearch={setOpenSearch}
          onApply={(filters) => {
            setReminderCreated(false);
            setAppliedSearch(filters);
            setItems([]);
            setPage(0);
          }}
        />
      )}

      <ReminderModal
        open={openReminder}
        onClose={() => setOpenReminder(false)}
        filters={appliedSearch}
        onSubmit={(filters) => {
          console.log("create reminder:", filters);
          setReminderCreated(true);
        }}
      />
    </div>
  );
}
