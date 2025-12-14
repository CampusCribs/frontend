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
            className="shadow-sm px-20 py-3 rounded-2xl flex justify-center bg-neutral-200 border border-black/10 font-semibold text-black/70 cursor-pointer w-full max-w-md"
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
              {curated &&
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
                )}
            </div>
          </div>
          <div />
          <div ref={ref} />
        </div>
      </div>
      {openSearch && <GuidedSearch />}
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
  thumbnail = buildImageURL(userId, id, thumbnail);

  return (
    <Card
      className="rounded-none  shadow-md m-0 w-full border-none cursor-pointer p-1"
      onClick={() => navigate(`/cribs/${id}`)}
      key={id}
    >
      <CardContent className="p-0 m-0 w-full border-none aspect-[4/3] ">
        <img
          src={thumbnail}
          alt="Residence"
          className="object-cover aspect-[4/3] w-full h-full"
        />
      </CardContent>
      <CardFooter className="p-0 m-0 w-full px-4 py-2">
        <div className="flex justify-between  w-full ">
          <div className="flex items-center">
            <div className="flex ">
              <div className="text-md font-bold">${price}</div>
            </div>
            <div className="flex justify-center  items-center">
              <Dot width={24} height={24} />
            </div>
            <div className="flex w-full ">
              <div className="text-md font-bold">{location}</div>
            </div>
          </div>
          <div className="flex  items-center justify-center mr-5 w-full">
            {ableToUse && iconKey != "" ? (
              <div className="relative group">
                <div className="absolute left-1/2 bottom-full translate-x-[-50%] mb-2 flex-col items-center group-hover:flex hidden ">
                  <div className=" z-20 p-2 bg-white text-center rounded shadow text-sm">
                    Student at the {name}
                  </div>
                </div>

                <img
                  title="UC Logo"
                  className="w-10"
                  src={import.meta.env.VITE_SCHOOL_LOGO + iconKey}
                />
              </div>
            ) : !ableToUse && iconKey != "" ? (
              <div className="relative group">
                <div className="absolute left-1/2 bottom-full translate-x-[-50%] mb-2 flex-col items-center group-hover:flex hidden ">
                  <div className=" z-20 p-2 bg-white text-center rounded shadow text-sm">
                    Student at the {name}
                  </div>
                </div>
                <div className="flex justify-center items-center w-full">
                  <p className=" font-semibold text-lg italic ">UC</p>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="absolute left-1/2 bottom-full translate-x-[-50%] mb-2 flex-col items-center group-hover:flex hidden ">
                  <div className=" z-20 p-2 bg-white text-center rounded shadow text-sm">
                    Not verified
                  </div>
                </div>
                <ShieldOff />
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CribsPage;
