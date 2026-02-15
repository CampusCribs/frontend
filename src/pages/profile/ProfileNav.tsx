import { useGetProfileUsername } from "@/gen";
import LandlordProfilePage from "./LandlordPage";
import ProfilePage from "./ProfilePage";
import LandlordUsernamePage from "./username/LandlordUsernamePage";
import ProfileUsernamePage from "./username/ProfileUsernamePage";
import { useParams } from "react-router";
import LoadingPage from "../loading/LoadingPage";

export const ProfileNavUsername = () => {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError } = useGetProfileUsername(username || "");
  console.log(data);
  if (isLoading) {
    return <LoadingPage />;
  }
  if (data) {
    if (data.data.role === "STUDENT") {
      return <ProfileUsernamePage />;
    }

    if (data.data.role === "LANDLORD") {
      return <LandlordUsernamePage landlord={data.data} />; //finished wireing non profile
    }
  }
  if (isError) {
    return <div>something wrong</div>;
  }
};

export const ProfileNavHome = () => {
  const role = "STUDENT";

  if (role === "STUDENT") {
    return <ProfilePage />;
  }

  if (role === "LANDLORD") {
    return <LandlordProfilePage />;
  }
};
