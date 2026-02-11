import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertCircle,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useInView } from "react-intersection-observer";

import { useNavigate } from "react-router";
import { buildImageURL } from "@/lib/image-resolver";

import Lottie from "lottie-react";
import house from "@/components/ui/houseanimation.json";
import GuidedSearch from "./GuidedSearch";
import { ResidenceCardDTO, useGetCuratedCribsInfinite } from "@/gen";

const CribsPage = () => {
  //variables to store the selected tags and the state of the tag selector and find the intersection of the tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [verification, setVerification] = useState<
    "ANY" | "VERIFIED" | "UNVERIFIED"
  >("ANY");
  const [roommatesMin, setRoommatesMin] = useState<number | null>(0);
  const [roommatesMax, setRoommatesMax] = useState<number | null>(10);
  const [start, setStart] = useState<string | null>(new Date().toISOString());
  const [end, setEnd] = useState<string | null>(null);
  // local controlled inputs for price (to avoid half-updates)
  const [minPrice, setMinPrice] = useState<number | null>(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ref, inView } = useInView();

  function omitNullish<T extends Record<string, any>>(obj: T) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => {
        if (v === null || v === undefined) return false;
        if (typeof v === "string" && v.trim() === "") return false;
        if (Array.isArray(v) && v.length === 0) return false;
        return true; // keep 0 and false
      }),
    ) as Partial<T>;
  }

  const params = omitNullish({
    page: 0,
    size: 10,
    sort: ["createdAt,desc"],
    tag: selectedTags, // [] will be dropped
    roommatesMin,
    roommatesMax,
    minPrice,
    maxPrice,
    startDate: start, // "" or null gets dropped
    endDate: end,
    verification,
  });

  const {
    data: curated,
    error: curated_error,
    isLoading: curated_isLoading,
  } = useGetCuratedCribsInfinite(params);

  useEffect(() => {
    if (inView) {
      // call the generated function
    }
  }, [inView]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col w-full  ">
        <div className="flex w-full p-2 justify-center items-center">
          <div
            className="shadow-sm px-20 py-3 rounded-2xl flex justify-center bg-white-100 border border-black/10 font-semibold text-black/70 cursor-pointer w-full max-w-md"
            onClick={() => setOpenSearch(!openSearch)}
          >
            <Search className="mr-2 text-black/70" /> Start your search
          </div>
        </div>
        <div className="flex flex-col">
          <div className="w-full ">
            {/* {curated_isLoading && (
              <div className="flex w-full h-[400px] justify-center items-center ">
                <div className="flex flex-col items-center justify-center">
                  <Lottie
                    animationData={house}
                    loop
                    autoplay
                    style={{ width: 200, height: 200 }}
                  />
                  <div>loading...</div>
                </div>
              </div>
            )} */}
            {/* {curated_error?.response?.status && curated_error && (
              <div className="flex w-full h-[400px] justify-center items-center ">
                <div className="flex flex-col">
                  <div className="flex justify-center mb-4">
                    <CircleX size={82} />
                  </div>
                  <div>An Error Occured</div>
                </div>
              </div>
            )} */}
            {/* {curated?.pages[0].status === 202 && (
              <div className="flex w-full h-[400px] justify-center items-center ">
                <div className="flex flex-col">
                  <div className="flex justify-center mb-4">
                    <SearchX size={82} />
                  </div>
                  <div>No residences found</div>
                </div>
              </div>
            )} */}
            <div className="grid grid-cols-2 gap-1 w-full p-2">
              {/* {curated &&
                curated.pages.map((item) =>
                  item.data.content?.map((residence) => (
                    <ResidenceCard
                      key={residence.id}
                      userId={residence.userId || ""}
                      thumbnail={residence.mediaId || ""}
                      id={residence.id || ""}
                      price={residence.price || 0}
                      location="CUF"
                      name={residence.name || ""}
                      iconKey={residence.iconKey || ""}
                      ableToUse={residence.ableToUse || false}
                    />
                  ))
                )} */}
              {curated?.pages.map((page) =>
                page.data?.items.map((crib) => (
                  <>
                    <ResidenceCard key={crib.id} data={crib} />
                    <ResidenceCard key={crib.id} data={crib} />
                    <ResidenceCard key={crib.id} data={crib} />
                    <ResidenceCard key={crib.id} data={crib} />
                    <ResidenceCard key={crib.id} data={crib} />
                    <ResidenceCard key={crib.id} data={crib} />
                    <ResidenceCard key={crib.id} data={crib} />
                  </>
                )),
              )}
            </div>
          </div>
          <div />
          <div ref={ref} />
        </div>
      </div>
      {openSearch && <GuidedSearch setOpenSearch={setOpenSearch} />}
    </div>
  );
};

export function ResidenceCard({ data }: { data: ResidenceCardDTO }) {
  const navigate = useNavigate();

  const isVerified = data.verification === "Verified";
  const isStudent = data.role === "Student";

  const roleClasses = isStudent
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-blue-50 text-blue-700 ring-blue-200";

  const verificationClasses = isVerified
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-gray-100 text-gray-600 ring-gray-200";

  return (
    <Card
      onClick={() => navigate(`/cribs/${data.id}`)}
      className="cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition"
    >
      {/* IMAGE (BIGGER) */}
      <CardContent className="p-0 relative ">
        <img
          src={data.thumbnailUrl}
          alt="Residence"
          className="h-full w-full object-cover"
        />

        {/* gradient only at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* location overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-white text-sm font-semibold truncate">
                <MapPin size={14} />
                <span className="truncate">{data.locationLabel}</span>
              </div>
              <div className="text-white/90 text-xs font-medium">
                Tap to view details
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* FOOTER (REDESIGNED) */}
      <CardFooter className="px-2 ">
        <div className="w-full space-y-2">
          {/* Row 1: Price + Availability */}
          <div className="flex flex-wrap items-start justify-between  ">
            <div className="text-base font-semibold text-gray-900 leading-tight ">
              ${data.priceMonthly}{" "}
              <span className="text-xs font-medium text-gray-500">/ mo</span>
            </div>

            <div className="shrink-0 text-xs font-medium text-gray-600 ">
              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 ring-1 ring-inset ring-gray-200">
                <Clock size={12} />
                Available {formatAvailability(data.availability)}
              </span>
            </div>
          </div>

          {/* Row 2: Identity */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-gray-400" />
                <div className="truncate text-sm font-medium text-gray-900">
                  {data.identity.companyName}
                </div>
              </div>
              <div className="mt-0.5 truncate text-xs text-gray-500">
                {data.identity.universityName}
              </div>
            </div>

            {/* optional action indicator */}
            <ChevronRight className="text-gray-300" size={18} />
          </div>

          {/* Row 3: Role + Verification (Trust line) */}
          <div className="flex-wrap items-center gap-2 space-x-1 pt-1">
            <span
              className={[
                "inline-flex items-center gap-1 rounded-full px-2 py-1 mb-1 text-xs font-medium ring-1 ring-inset",
                roleClasses,
              ].join(" ")}
            >
              {isStudent ? <ShieldCheck size={12} /> : <BadgeCheck size={12} />}
              {data.role}
            </span>

            <span
              className={[
                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                verificationClasses,
              ].join(" ")}
              title={
                isVerified
                  ? "This poster completed verification."
                  : "This poster has not completed verification yet."
              }
            >
              {isVerified ? (
                <CheckCircle2 size={12} />
              ) : (
                <AlertCircle size={12} />
              )}
              {data.verification}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

function formatAvailability(a) {
  if (a.type === "Immediate") return "Immediate";

  // Keep it simple and predictable: show "Aug 1, 2026" in user locale
  const d = new Date(a.date);
  if (Number.isNaN(d.getTime())) return a.date; // fallback if date parsing fails

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
export default CribsPage;
