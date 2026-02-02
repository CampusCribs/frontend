import LandlordProfilePage from "./LandlordPage";
import ProfilePage from "./ProfilePage";
import LandlordUsernamePage from "./username/LandlordUsernamePage";
import ProfileUsernamePage from "./username/ProfileUsernamePage";

export const ProfileNavUsername = () => {
  const role = "LANDLORD";

  if (role === "STUDENT") {
    return <ProfileUsernamePage />;
  }

  if (role === "LANDLORD") {
    return <LandlordUsernamePage />;
  }
  return <div>error occured please reach out</div>;
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
