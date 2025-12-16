import { School, Search, X } from "lucide-react";
import { useState } from "react";

const GuidedSearch = ({
  setOpenSearch,
}: {
  setOpenSearch: (open: boolean) => void;
}) => {
  const [active, setActive] = useState<"filter" | "where" | "when">("where");
  return (
    <div className="absolute inset-0 z-50 w-full h-full bg-black/50 flex flex-col">
      <div className="flex justify-end cursor-pointer p-1">
        <div
          className="bg-white rounded-full p-1"
          onClick={() => setOpenSearch(false)}
        >
          <X size={24} />
        </div>
      </div>

      {/* Where Section */}
      <div
        className="flex bg-white mx-3 mt-3 rounded-2xl p-4 shadow-lg flex-col"
        onClick={() => setActive("where")}
      >
        <h1 className="text-2xl font-bold">Where?</h1>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out
      ${active === "where" ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"}
    `}
        >
          <div className="flex items-center border rounded-2xl p-2 mt-3">
            <Search />{" "}
            <input
              type="text"
              placeholder="Search for a location"
              className=" p-2 w-full"
            />
          </div>
          <div className="mt-2">suggested Campuses</div>
          <div className="flex flex-col space-y-2">
            {Array.from(["UCLA", "UCSD", "UC Berkeley", "UCI"]).map(
              (campus) => (
                <WhereItem key={campus} campus={campus} />
              )
            )}
          </div>
        </div>
      </div>

      {/* When Section */}
      <div
        className="flex bg-white mx-3 mt-3 rounded-2xl p-4 shadow-lg flex-col transition-transform duration-200"
        onClick={() => setActive("when")}
      >
        <h1 className="text-2xl font-bold">When?</h1>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out
      ${active === "when" ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"}
    `}
        >
          <div className="flex flex-col space-y-2">
            {Array.from(["UCLA", "UCSD", "UC Berkeley", "UCI"]).map(
              (campus) => (
                <WhereItem key={campus} campus={campus} />
              )
            )}
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div
        className="flex bg-white mx-3 mt-3 rounded-2xl p-4 shadow-lg flex-col transition-transform duration-200"
        onClick={() => setActive("filter")}
      >
        <h1 className="text-2xl font-bold">Filters?</h1>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out
      ${active === "filter" ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"}
    `}
        >
          <div className="flex flex-col space-y-2">
            {Array.from(["UCLA", "UCSD", "UC Berkeley", "UCI"]).map(
              (campus) => (
                <WhereItem key={campus} campus={campus} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const WhereItem = ({ campus }: { campus: string }) => {
  return (
    <div className="p-2 hover:bg-gray-400 cursor-pointer flex items-center border rounded-xl">
      <div>
        <School size={32} />
      </div>
      <div className="ml-5">{campus}</div>
    </div>
  );
};
export default GuidedSearch;
