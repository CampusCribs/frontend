import {
  ArrowLeftIcon,
  Calendar,
  CircleUserRound,
  DollarSign,
  Flag,
  Send,
  Tag,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ShareModal from "@/components/modals/ShareModal";
import {
  ReportModal,
  type ReportValues,
} from "@/components/modals/ReportModal";
import { useGetIndividualCrib, usePostIndividualCribReport } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import IndividualSlider from "./IndividualSlider";
import { LocationInfoCard } from "./LocationInfoCard";

function formatDateISO(iso: string) {
  return new Date(iso).toISOString().split("T")[0];
}

const IndividualPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const config = useAuthenticatedClientConfig();
  const [openShare, setOpenShare] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const { data: postData } = useGetIndividualCrib(postId || "", {
    client: config,
  });
  const { mutateAsync: reportCrib } = usePostIndividualCribReport({
    client: config,
  });

  useEffect(() => {
    localStorage.setItem("headerText", "Crib Details");
  }, []);

  async function handleReport(values: ReportValues) {
    if (!postId) return;

    try {
      await reportCrib({
        id: postId,
        data: {
          type: values.reason,
          description: values.details ?? null,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="mb-6">
      <div className="px-3 pt-3">
        <div
          onClick={() => window.history.back()}
          className="inline-flex cursor-pointer items-center"
        >
          <ArrowLeftIcon size={32} />
          <span className="ml-2">Back</span>
        </div>
      </div>

      <div>
        <IndividualSlider
          images={postData?.data.mediaIds || []}
          userId={postData?.data.userId || ""}
          postId={postData?.data.postId || ""}
        />
      </div>

      <div className="my-1 flex w-full flex-row items-center gap-4">
        <button
          type="button"
          className="ml-4"
          onClick={() => setOpenShare(true)}
          aria-label="Share crib"
        >
          <Send size={25} />
        </button>

        <button
          type="button"
          className="ml-auto mr-5 rotate-3"
          onClick={() => setOpenReport(!openReport)}
          aria-label="Report crib"
        >
          <Flag size={25} className="cursor-pointer" />
        </button>
      </div>

      <div className="px-5 pt-4">
        <div
          className="flex flex-row items-center gap-4"
          onClick={() => navigate("/profile/123")}
        >
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border bg-slate-100 shadow-sm">
            {postData?.data.userThumbnailUrl ? (
              <img
                src={postData.data.userThumbnailUrl}
                alt="profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <CircleUserRound size={40} className="text-slate-500" />
            )}
          </div>

          <div className="flex min-w-0 flex-col">
            <h1 className="truncate text-lg font-semibold leading-tight text-slate-900">
              {postData?.data.firstName} {postData?.data.lastName}
            </h1>
            <p className="text-sm leading-tight text-slate-600">
              @{postData?.data.username}
            </p>
            <p className="mt-1 truncate text-xs text-slate-500">
              {postData?.data.institutionName}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="text-2xl font-semibold text-slate-900">
          {postData?.data.title}
        </div>
        <div className="mt-2 break-words text-base leading-relaxed text-slate-700">
          {postData?.data.description}
        </div>
      </div>

      <div className="my-10 px-5 text-md">
        <div className="flex items-baseline gap-2">
          <DollarSign size={18} className="shrink-0 text-slate-400" />
          <span className="text-slate-900">${postData?.data.price} / month</span>
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <Users size={18} className="shrink-0 text-slate-400" />
          <span className="text-slate-900">
            {postData?.data.roommates} roommates
          </span>
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <Calendar size={18} className="shrink-0 text-slate-400" />
          <span className="text-slate-900">
            {postData?.data.termStartDate &&
              formatDateISO(postData.data.termStartDate)}{" "}
            to{" "}
            {postData?.data.termEndDate && formatDateISO(postData.data.termEndDate)}
          </span>
        </div>

        <div className="mt-2 flex items-start gap-2">
          <Tag size={18} className="mt-[2px] shrink-0 text-slate-400" />
          <div className="text-slate-600">
            {postData?.data.tags.map((tag, index) => (
              <span key={`${tag.name}-${index}`}>
                {tag.name}
                {index < postData.data.tags.length - 1 && (
                  <span className="text-slate-400"> · </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {postData?.data.campusLocation?.label && (
        <LocationInfoCard
          label={postData.data.campusLocation.label}
          lat={postData.data.campusLocation.lat}
          lng={postData.data.campusLocation.lng}
          commuteBucket={postData.data.commuteBucket}
        />
      )}

      <div className="flex flex-row-reverse px-5 pt-5">
        <button
          className="my-2 cursor-pointer rounded-full bg-black px-5 py-3 font-semibold text-white shadow-lg active:scale-[0.99]"
          onClick={() => navigate(`/chats/${postData?.data.username}`)}
        >
          Chat
        </button>
      </div>

      {openReport && (
        <ReportModal
          open={openReport}
          onClose={() => setOpenReport(false)}
          onSubmit={(values) => {
            void handleReport(values);
          }}
        />
      )}

      {openShare && (
        <ShareModal
          open={openShare}
          onClose={() => setOpenShare(false)}
          title={`Check out ${postData?.data.firstName}'s crib on CampusCribs`}
          url={window.location.href}
        />
      )}
    </div>
  );
};

export default IndividualPage;
