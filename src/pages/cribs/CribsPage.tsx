import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CircleX, Dot, Search, SearchX, ShieldOff } from "lucide-react";
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
      })
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
            className="shadow-sm px-20 py-3 rounded-2xl flex justify-center bg-neutral-100 border border-black/10 font-semibold text-black/70 cursor-pointer w-full max-w-md"
            onClick={() => setOpenSearch(!openSearch)}
          >
            <Search className="mr-2 text-black/70" /> Start your search
          </div>
        </div>
        <div className="flex flex-col">
          <div className="w-full ">
            {curated_isLoading && (
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
            )}
            {curated_error?.response?.status && curated_error && (
              <div className="flex w-full h-[400px] justify-center items-center ">
                <div className="flex flex-col">
                  <div className="flex justify-center mb-4">
                    <CircleX size={82} />
                  </div>
                  <div>An Error Occured</div>
                </div>
              </div>
            )}
            {curated?.pages[0].status === 202 && (
              <div className="flex w-full h-[400px] justify-center items-center ">
                <div className="flex flex-col">
                  <div className="flex justify-center mb-4">
                    <SearchX size={82} />
                  </div>
                  <div>No residences found</div>
                </div>
              </div>
            )}
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
                  userId={`user-${index}`}
                  thumbnail="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLbpGDcJYb2oBnoSKM5niQxRGJEEr9U3_CbA&s"
                  id={`res-${index}`}
                  price={900 + index * 50}
                  location="CUF"
                  name={`Residence ${index + 1}`}
                  iconKey="https://1000logos.net/wp-content/uploads/2021/12/Cincinnati-Bearcats-Logo.jpg"
                  ableToUse={index % 2 === 0}
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

export const ResidenceCard = ({
  userId,
  thumbnail,
  id,
  price,
  location,
  name,
  iconKey,
  ableToUse,
}: {
  userId: string;
  thumbnail: string;
  id: string;
  price: number;
  location: string;
  name: string;
  iconKey: string;
  ableToUse: boolean;
}) => {
  const navigate = useNavigate();
  // thumbnail = buildImageURL(userId, id, thumbnail);

  return (
    <Card
      className="group overflow-hidden border bg-white shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => navigate(`/cribs/${id}`)}
    >
      <CardContent className="p-0 aspect-[4/3] relative">
        <img
          src={thumbnail}
          alt="Residence"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm truncate">
              {location}
            </div>
            <div className="text-white/90 text-xs font-medium">
              ${price} / mo
            </div>
          </div>
          <div className="shrink-0">
            <VerificationBadge
              ableToUse={ableToUse}
              iconKey={iconKey}
              name={name}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-2 flex items-center justify-between">
        <div className="text-xs text-gray-500">Jan-Dec | No Animals</div>
        <span className="text-xs font-medium text-blue-600 group-hover:underline">
          View
        </span>
      </CardFooter>
    </Card>
  );
};

function VerificationBadge({
  ableToUse,
  iconKey,
  name,
}: {
  ableToUse: boolean;
  iconKey: string;
  name: string;
}) {
  if (iconKey && ableToUse) {
    return (
      <div className="relative group">
        <img
          className="w-8 h-8 object-cover rounded-full"
          src={iconKey}
          alt="School logo"
        />
        <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 hidden group-hover:block">
          <div className="z-20 px-2 py-1 bg-white rounded shadow text-xs whitespace-nowrap">
            Student at {name}
          </div>
        </div>
      </div>
    );
  }

  if (iconKey && !ableToUse) {
    return (
      <div className="relative group">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
          <p className="font-semibold text-xs italic">UC</p>
        </div>
        <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 hidden group-hover:block">
          <div className="z-20 px-2 py-1 bg-white rounded shadow text-xs whitespace-nowrap">
            Student at {name}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <ShieldOff className="w-5 h-5 text-gray-400" />
      <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 hidden group-hover:block">
        <div className="z-20 px-2 py-1 bg-white rounded shadow text-xs whitespace-nowrap">
          Not verified
        </div>
      </div>
    </div>
  );
}

export default CribsPage;
