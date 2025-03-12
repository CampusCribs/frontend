import { ArrowLeftIcon } from "lucide-react";
import IndividualSlider from "./IndividualSlider";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
const initialState = {
  title: "I need a Roommate!",
  description:
    "Hey I need a roomate thats super cool and chill to live with me in my apartment. I have a dog and a cat so you must be pet friendly!",
  price: 500,
  roommates: 4,
  BeginDate: new Date().toISOString(),
  EndDate: new Date().toISOString(),
  tags: [
    "pet friendly",
    "chill",
    "cool",
    "clean freak",
    "no smoking",
    "early bird",
  ],
};

const IndividualPage = () => {
  const navigate = useNavigate();
  //fetch images from server and pass them to the slider prop
  const images = [
    "https://picsum.photos/id/100/600/600",
    "https://picsum.photos/id/101/600/600",
    "https://picsum.photos/id/102/600/600",
    "https://picsum.photos/id/103/600/600",
    "https://picsum.photos/id/104/600/600",
  ];
  return (
    <div className="mb-6">
      <div
        className="flex justify-start pl-4 pb-3"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon size={40} />
      </div>
      <div>
        <IndividualSlider images={images} />
      </div>
      <div className="flex ">
        <div>
          <img
            alt="profile"
            src="https://picsum.photos/id/103/600/600"
            className="rounded-full h-20 m-5 shadow-2xl border"
          />
        </div>
        <div className="flex flex-col justify-center border-b">
          <div className="font-semibold text-xl">Johnny Smith </div>
          <div>@JohnnySmith1432</div>
          <div className="flex">
            <div className="text-xs font-light mr-2">(912)-222-8282</div>
            <div className="text-xs font-light">Tasmith@mail.uc.edu</div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-3xl font-semibold p-4">{initialState.title}</div>
        <div className="text-lg px-6">{initialState.description}</div>
        <div className="text-lg px-8 py-3 flex">
          <div className="font-semibold flex mr-1">Price: </div>{" "}
          {initialState.price}
        </div>
        <div className="text-lg pb-3 px-8 flex">
          <div className="font-semibold mr-1">Roommates:</div>
          {initialState.roommates}
        </div>
        <div className="text-lg px-8 flex mb-3">
          <div className="mr-1 font-semibold">Lease from:</div>{" "}
          {new Date(initialState.BeginDate).toLocaleDateString()} to{" "}
          {new Date(initialState.EndDate).toLocaleDateString()}
        </div>
        <div className="text-lg px-8 flex">
          <div className="mr-1 font-semibold">Tags:</div>
        </div>
        <div className="flex justify-center border rounded-xl mx-8 my-2 py-2">
          <div className="flex max-w-[400px] flex-wrap p-4 justify-center">
            {initialState.tags.map((item, index) => (
              <div
                key={index}
                className="flex p-2 bg-black text-white m-1 rounded-full shadow-xl"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-row-reverse px-8 py-2">
        <button
          className="bg-blue-500 rounded-full p-3 px-4 shadow-xl text-white underline "
          onClick={() => navigate("/profile/1234")}
        >
          Contact
        </button>
      </div>
    </div>
  );
};

export default IndividualPage;
