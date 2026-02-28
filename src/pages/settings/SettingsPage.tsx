import { ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

const settings = [
  {
    id: "account",
    name: "Account",
    description: "Email, password, verification",
    link: "/settings/account",
  },
  {
    id: "profile",
    name: "Profile",
    description: "Public information and avatar",
    link: "/settings/profile",
  },
  {
    id: "privacy",
    name: "Privacy & Safety",
    description: "Who can see and contact you",
    link: "/settings/privacy",
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "Email, push, and in-app alerts",
    link: "/settings/notifications",
  },
  {
    id: "support",
    name: "Support",
    description: "Contact us for help",
    link: "/settings/support",
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="  mx-auto min-h-[100dvh] bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <button
          title="back"
          onClick={() => navigate("/profile")}
          className="p-2 rounded-full hover:bg-black/5 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-xl font-semibold text-black/90">Settings</h1>
      </div>
      {/* List */}
      <div className="mt-4 border-t">
        {settings.map((setting) => (
          <button
            key={setting.id}
            onClick={() => navigate(setting.link)}
            className="w-full flex items-center justify-between px-1 py-4 text-left border-b hover:bg-black/[0.03] transition"
          >
            <div className="flex flex-col px-5">
              <span className="text-base font-medium text-black/90">
                {setting.name}
              </span>
              <span className="text-sm text-black/60">
                {setting.description}
              </span>
            </div>

            <ChevronRight className="text-black/40" size={18} />
          </button>
        ))}
      </div>
    </div>
  );
}
