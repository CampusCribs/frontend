import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  BadgeCheck,
  BadgeCheckIcon,
  Building2,
  CheckCircle,
  CheckCircle2,
  CircleX,
  DollarSign,
  Dot,
  GraduationCap,
  HelpCircle,
  HelpCircleIcon,
  MapPin,
  Search,
  SearchX,
  ShieldCheckIcon,
  ShieldOff,
  Verified,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useInView } from "react-intersection-observer";

import { useNavigate } from "react-router";
import { useGetPublicCuratedInfinite } from "@/gen";
import { buildImageURL } from "@/lib/image-resolver";

import Lottie from "lottie-react";
import house from "@/components/ui/houseanimation.json";
import GuidedSearch from "./GuidedSearch";

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
  } = useGetPublicCuratedInfinite(params);

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
              {Array.from({ length: 10 }).map((_, index) => (
                <ResidenceCard
                  key={index}
                  thumbnail="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLbpGDcJYb2oBnoSKM5niQxRGJEEr9U3_CbA&s"
                  id={`res-${index}`}
                  price={900 + index * 50}
                  location="CUF"
                  role={
                    index % 3 === 0
                      ? "LANDLORD"
                      : index % 3 === 1
                        ? "STUDENT"
                        : "UNVERIFIED"
                  }
                />
              ))}
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

export function ResidenceCard() {
  const navigate = useNavigate();

  // ---- STATIC DATA ----
  const id = "abc123";
  const thumbnail =
    "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1400&q=80";

  const location = "Clifton · Cincinnati, OH";
  const price = 875;

  const role = "Landlord"; // Student | Landlord
  const verification = "Unverified";

  const companyName = "Queen City Property Group";
  const university = "University of Cincinnati";
  // ---------------------

  return (
    <Card
      onClick={() => navigate(`/cribs/${id}`)}
      className="cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition"
    >
      {/* IMAGE (BIG) */}
      <CardContent className="p-0 relative aspect-[16/10]">
        <img
          src={thumbnail}
          alt="Residence"
          className="h-full w-full object-cover"
        />

        {/* gradient only at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 to-transparent" />

        {/* location + price */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-white text-sm font-semibold truncate">
                <MapPin size={14} />
                <span className="truncate">{location}</span>
              </div>
              <div className="text-white/90 text-xs font-medium">
                ${price} / mo
              </div>
            </div>

            <span className="text-white/90 text-xs font-medium">View</span>
          </div>
        </div>
      </CardContent>

      {/* FOOTER (THIN + CLEAN) */}
      <CardFooter className="flex flex-col gap-2 px-4 ">
        {/* role + verification */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs px-2  rounded-full bg-blue-50 text-blue-700">
            <BadgeCheck size={12} />
            {role}
          </span>
        </div>

        {/* identity */}
        <div className="text-sm text-gray-900 font-medium leading-tight">
          {companyName}
        </div>

        <div className="text-xs text-gray-500">{university}</div>
      </CardFooter>
    </Card>
  );
}
export default CribsPage;
