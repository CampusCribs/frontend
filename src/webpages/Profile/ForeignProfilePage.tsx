import { Undo2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";

const ForeignProfilePage = () => {
  const navigate = useNavigate();
  const { userName } = useParams<{ userName: string }>();
  console.log(userName);
  //fetch data from server
  const profiledata = {
    image: "https://picsum.photos/id/10/600/600",
    name: "Johny Rockets",
    username: "johnnySmith1432",
    bio: "Hey everyone, I'm Johnny! I need to get a place to stay in Cincinnati for the summer. I'm a student at UC and I'm looking for a place to stay near campus. I'm a pretty chill guy, I like to play video games and watch movies. I'm looking for a place with a private bathroom and a kitchen. I'm also looking for a place that's close to campus. I'm looking to move in by the end of May. If you have a place that fits my needs, please let me know. Thanks!😂😂",
  };
  //fetch post data from server
  const postdata = {
    id: "1234",
    title: "I need a Roommate! asap asap asap",
    image: "https://picsum.photos/id/100/600/600",
    price: 500,
  };
  return (
    <div>
      <div className="flex w-full">
        <Undo2 className=" m-4" size={40} onClick={() => navigate(-1)} />
      </div>
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
          <div className="w-full border-t r p-4 border-b ">
            <p>{profiledata.bio}</p>
          </div>
        </div>
      </div>
      <div>
        <div
          className="m-9 relative text-xl text-white cursor-pointer"
          onClick={() => navigate(`/posts/${id}`)}
        >
          <img
            src={postdata.image}
            alt="post image"
            className="rounded-2xl  shadow-xl"
          />
          <div className="absolute bottom-0 w-full h-14 bg-black opacity-40 blur-sm flex items-center justify-between rounded-b-2xl" />
          <div className="absolute bottom-4 left-5 overflow-hidden overflow-ellipsis max-w-[200px]  text-nowrap">
            {postdata.title}
          </div>
          <div className="absolute bottom-4 right-5 ">${postdata.price}</div>
        </div>
      </div>
    </div>
  );
};

export default ForeignProfilePage;
