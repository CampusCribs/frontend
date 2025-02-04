import { BellDot, Home, Users, Video } from "lucide-react";

const Footer = () => {
  return (
    <div className="flex justify-between items-around p-4">
      <div className="flex flex-col items-center gap-1 w-[100px]">
        <Home />
        <div className="text-sm">Home</div>
      </div>
      <div className="flex flex-col items-center gap-1 w-[100px]">
        <Video />
        <div className="text-sm">Video</div>
      </div>
      <div className="flex flex-col items-center gap-1 w-[100px]">
        <Users />
        <div className="text-sm">Friends</div>
      </div>
      <div className="flex flex-col items-center gap-1 w-[100px]">
        <BellDot />
        <div className="text-sm">Notifications</div>
      </div>
    </div>
  );
};

export default Footer;
