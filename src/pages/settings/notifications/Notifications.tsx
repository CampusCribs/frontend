// import { useGetNotificationsInfinite, useMarkNotificationAsRead } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";

const Notifications = () => {
  const config = useAuthenticatedClientConfig();
  // const { data } = useGetNotificationsInfinite({}, { ...config });
  return (
    <div>
      <div className=" pt-3">
        <div className="px-3 pt-3">
          <div
            onClick={() => window.history.back()}
            className="cursor-pointer inline-flex items-center"
          >
            <ArrowLeftIcon size={32} />
            <span className="ml-2">Back</span>
          </div>
        </div>
        <div className="flex items-center justify-center text-xl font-semibold mt-5">
          Notifications
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col mt-3 w-full py-5 rounded-lg">
            {/* {data &&
            data.pages?.flatMap((page) => page.data?.content).length > 0 ? (
              data.pages.map((item) =>
                item.data?.content?.map((item) => (
                  <Notification
                    title={item.title || ""}
                    content={item.content || ""}
                    isRead={item.read}
                    id={item.id || ""}
                  />
                ))
              )
            ) : (
              <div className="flex items-center justify-center border-t pt-10">
                No notifications
              </div>
            )}
            {data &&
              data.pages.flatMap((page) => page.data.content).length > 0 && (
                <div className="w-full border-t" />
              )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

const Notification = ({
  title,
  content,
  isRead,
  id,
}: {
  title: string;
  content: string;
  isRead?: boolean;
  id: string;
}) => {
  const config = useAuthenticatedClientConfig();
  // const { mutateAsync } = useMarkNotificationAsRead({ ...config });

  const navigate = useNavigate();
  const handleClick = async () => {
    // await mutateAsync({ id: id }).then(() => navigate("/profile"));
  };
  return (
    <div
      className="border-t w-full px-4 py-2 flex cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex flex-col gap-y-1.5">
        <div className="font-semibold ">{title}</div>
        <div className="text-sm">{content}</div>
      </div>
      {!isRead && (
        <div className="ml-auto flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-red-500" />
        </div>
      )}
    </div>
  );
};

export default Notifications;
