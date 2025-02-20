import { useState } from "react";
import AddPostPageOne from "./AddPostFormOne";
import AddPostPageTwo from "./AddPostPageTwo";
import { ArrowLeftIcon } from "lucide-react";

const AddPostPage = () => {
  const [move, setMove] = useState(false);
  const [submit, setSubmit] = useState(false);

  const moveBack = () => {
    if (move) {
      setMove(!move);
    }
  };
  const moveForward = () => {
    if (!move) {
      setMove(!move);
      if (submit) {
        setSubmit(false);
      }
    }
    if (move) {
      console.log("Submit");
      setSubmit(true);
    }
  };
  return (
    <div className={`w-full h-full`}>
      <div className="flex justify-start pl-4" onClick={moveBack}>
        <ArrowLeftIcon size={40} />
      </div>
      <div className="w-full flex justify-center items-center">
        <h1 className="text-4xl flex ">Add Post</h1>
      </div>
      <div className="flex flex-col bg-Card w-full ">
        <AddPostPageOne hide={move} submit={submit} errorGoBack={moveBack} />
        <AddPostPageTwo hide={!move} submit={submit} />
        <div className="flex flex-row-reverse justify-between p-4">
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full p-2 px-6 text-lg shadow-xl"
            onClick={moveForward}
          >
            {move ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPostPage;
