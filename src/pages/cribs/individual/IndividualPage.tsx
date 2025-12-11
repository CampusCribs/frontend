import { ArrowLeftIcon, CircleUserRound } from "lucide-react";
import IndividualSlider from "./IndividualSlider";
import { useNavigate } from "react-router";
import { useGetPublicCribPostid } from "@/gen";
import { buildThumbnailURL } from "@/lib/image-resolver";
import Error from "@/pages/error/Error";
import IndividualLoading from "./IndividualLoading";
import { useEffect } from "react";
const IndividualPage = () => {
  const navigate = useNavigate();
  //fetch images from server and pass them to the slider prop
  const id = window.location.pathname.split("/").pop() || "";
  const {
    data: post,
    error: post_error,
    isLoading: post_isLoading,
  } = useGetPublicCribPostid(id);

  const thumbnailUrl = buildThumbnailURL(
    post?.data?.userId || "",
    post?.data?.userThumbnailId || ""
  );
  useEffect(() => {
    localStorage.setItem("headerText", "Crib Details");
  }, []);
  if (post_isLoading) {
    return <IndividualLoading />;
  }
  if (post_error) {
    return <Error />;
  }
  return (
    <div className="mb-6">
      <div className="px-3 pt-3">
        <div
          onClick={() => window.history.back()}
          className="cursor-pointer inline-flex items-center"
        >
          <ArrowLeftIcon size={32} />
          <span className="ml-2">Back</span>
        </div>
      </div>
      <div>
        <IndividualSlider
          images={post?.data?.mediaIds || []}
          userId={post?.data?.userId || ""}
          postId={post?.data?.id || ""}
        />
      </div>

      {post && (
        <>
          <div className="flex ">
            {post && !post.data.userThumbnailId && (
              <div className="flex justify-center items-center ml-5">
                <CircleUserRound size={70} />
              </div>
            )}
            {post && post.data.userThumbnailId && (
              <div>
                <img
                  alt="profile"
                  src={thumbnailUrl}
                  className="rounded-full h-24 m-5 w-24 object-cover shadow-2xl border"
                />
              </div>
            )}

            <div className="flex flex-col w-3/4">
              <div className="text-lg font-medium px-4">
                {post?.data.firstName} {post?.data.lastName}
              </div>
              <div className="px-5 font-light text-md">
                @{post?.data.username}
              </div>
              <div className="text-wrap flex text-sm w-full mt-1 px-4 border-b pb-3">
                {post?.data?.institutionName && (
                  <div className="text-sm font-medium">
                    {post.data.institutionName}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="text-3xl font-semibold p-4">{post.data.title}</div>
            <div className="text-lg px-6 text-wrap wrap-break-word">
              {post.data.description}
            </div>
            <div className="text-lg px-8 py-3 flex">
              <div className="font-semibold flex mr-1">Price: </div>{" "}
              {post.data.price}
            </div>
            <div className="text-lg pb-3 px-8 flex">
              <div className="font-semibold mr-1">Roommates:</div>
              {post.data.roommates}
            </div>
            <div className="text-lg px-8 flex mb-3">
              <div className="mr-1 font-semibold">Lease from:</div>{" "}
              {post.data.termStartDate &&
                new Date(post.data.termStartDate)
                  .toISOString()
                  .split("T")[0]}{" "}
              to{" "}
              {post.data.termEndDate &&
                new Date(post.data.termEndDate).toISOString().split("T")[0]}
            </div>
            <div className="text-lg px-8 flex">
              <div className="mr-1 font-semibold">Tags:</div>
            </div>
            <div className="flex justify-center border rounded-xl mx-8 my-2 py-2">
              <div className="flex max-w-[400px] flex-wrap p-4 justify-center">
                {post.data.tags?.map((item, index) => (
                  <div
                    key={index}
                    className="flex p-2 bg-black text-white m-1 rounded-full shadow-xl"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse px-8 py-2">
            <button
              className="bg-blue-500 rounded-full p-3 px-4 shadow-xl text-white underline cursor-pointer "
              onClick={() => navigate(`/profile/${post.data.username}`)}
            >
              Contact
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default IndividualPage;
