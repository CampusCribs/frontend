import { ArrowLeftIcon } from "lucide-react";
import IndividualSlider from "./IndividualSlider";
import { useNavigate } from "react-router";

const initialState = {
  title: "I need a Roommate!",
  description: "Hey I need a roomate thats super cool and chill to live with",
  price: 500,
  roommates: 4,
  BeginDate: new Date().toISOString(),
  EndDate: new Date().toISOString(),
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
    <div>
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
        </div>
      </div>
      <div>render stuff</div>
    </div>
  );
};

export default IndividualPage;
