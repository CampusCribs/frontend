import { School, Search, X } from "lucide-react";

const GuidedSearch = () => {
  return (
    <div className="absolute inset-0 z-50 w-full h-full bg-black/50 flex flex-col">
      <div className="flex justify-end cursor-pointer p-1">
        <div className="bg-white rounded-full p-1">
          <X size={24} />
        </div>
      </div>
      <div className="flex bg-white m-3 rounded-2xl p-4 shadow-lg flex-col">
        <h1 className="text-2xl font-bold">Where?</h1>
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
          {Array.from(["UCLA", "UCSD", "UC Berkeley", "UCI", "UCSB"]).map(
            (campus) => (
              <WhereItem key={campus} campus={campus} />
            )
          )}
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
