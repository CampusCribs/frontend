import ProfilePage from "./ProfilePage";
import LandlordUsernamePage from "./username/LandlordUsernamePage";
import ProfileUsernamePage from "./username/ProfileUsernamePage";
import { useParams } from "react-router";
import LoadingPage from "../loading/LoadingPage";
import { useMe } from "@/hooks/use-me";
import { useGetAppProfileUsername } from "@/gen";
import LandlordPage from "./LandlordPage";

export const ProfileNavUsername = () => {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError } = useGetAppProfileUsername(username || "");
  console.log(data);
  if (isLoading) {
    return <LoadingPage />;
  }

  if (data) {
    if (data.data.profile.role === "STUDENT") {
      return (
        <ProfileUsernamePage
          student={data.data.profile}
          cribs={data.data.cribs}
          community={data.data.community}
        />
      );
    }

    if (data.data.profile.role === "LANDLORD") {
      return (
        <LandlordUsernamePage
          profile={data.data.profile}
          cribs={data.data.cribs}
        />
      );
    }
  }
  if (isError) {
    return <div>something wrong</div>;
  }
};

export const ProfileNavHome = () => {
  const me = useMe();
  const { data, isLoading, isError } = useGetAppProfileUsername(
    me?.me?.username || "",
  );
  console.log(data);
  if (isLoading) {
    return <LoadingPage />;
  }

  if (data?.data) {
    if (data.data.profile.role === "STUDENT") {
      return (
        <ProfilePage
          profile={data.data.profile}
          community={data?.data.community}
          cribs={data?.data.cribs}
        />
      );
    }

    if (data.data.profile.role === "LANDLORD") {
      return (
        <LandlordPage profile={data.data.profile} cribs={data.data.cribs} />
      );
    }
  }
};
