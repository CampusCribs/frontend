import { Home, Undo2 } from "lucide-react";
import { useNavigate } from "react-router";

const profiledata = {
  image: "https://picsum.photos/id/10/600/600",
  name: "Johny Rockets",
  username: "johnnyrrockets",
  bio: "Hey everyone, I'm Johnny! I need to get a place to stay in Cincinnati for the summer. I'm a student at UC and I'm looking for a place to stay near campus. I'm a pretty chill guy, I like to play video games and watch movies. I'm looking for a place with a private bathroom and a kitchen. I'm also looking for a place that's close to campus. I'm looking to move in by the end of May. If you have a place that fits my needs, please let me know. Thanks!😂😂",
};

const Bio = () => {
  return (
    <div className="w-full ">
      <div className="w-full justify-center items-center flex flex-col">
        <img
          className=" rounded-full w-1/2 border border-gray-900 shadow-2xl"
          src={profiledata.image}
          alt="profilepic"
        />
        <div className="w-full pl-[15%] mb-5">
          <h1 className="font-semibold text-xl">{profiledata.name}</h1>
          <p className="font-lightp pl-1"> @{profiledata.username}</p>
        </div>
        <div className="w-full border-t r p-4 ">
          <p>{profiledata.bio}</p>
        </div>
        <div className="border-b mt-6 relative w-full border-black flex justify-center items-center">
          <div className="absolute bg-white p-1 bottom-[-17 px] border-b-2 rounded-full  border-black">
            <Home className="" size={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = (props: { user: boolean }) => {
  const navigate = useNavigate();
  if (props.user) {
    return (
      <div>
        <div className="flex w-full">
          <Undo2 className=" m-4" size={40} onClick={() => navigate(-1)} />
        </div>
        <Bio />
        <p>what we do here?</p>
      </div>
    );
  } else {
    return (
      <div>
        <div className="flex w-full">
          <Undo2 className=" m-4" size={40} onClick={() => navigate(-1)} />
        </div>
        <Bio />
        this is foreign profile
        <p>what we do here?</p>
      </div>
    );
  }
};

export default ProfilePage;
