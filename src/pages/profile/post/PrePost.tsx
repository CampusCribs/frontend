import { HouseIcon, UserSearch } from "lucide-react";

const PrePost = () => {
  return (
    <div className="flex flex-col">
      <div className="border rounded-2xl">
        <HouseIcon className="h-6 w-6 text-gray-500" />
        <p>List your Crib</p>
      </div>
      <div>
        <UserSearch className="h-6 w-6 text-gray-500" />
        <p>Find Roommates Or Ask A Question</p>
      </div>
    </div>
  );
};

export default PrePost;
