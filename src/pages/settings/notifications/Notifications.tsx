import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function NotificationSettingsPage() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    // In-web (in-app UI notifications inside the webapp)
    webMessages: true,
    webContactRequests: true,
    webSystem: true,

    // Email
    emailSecurityAlerts: true, // often best to keep on
    emailProductUpdates: true,
    emailMarketing: false,
  });

  return (
    <div className="mx-auto min-h-[100dvh] bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <button
          title="back"
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-black/5 transition"
          type="button"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-xl font-semibold text-black/90">Notifications</h1>
      </div>

      <div className="mt-4 border-t">
        {/* In-web */}
        <div className="px-5 py-5 border-b">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-black/90">In-web</h2>
            <p className="text-sm text-black/60">
              Notifications you see inside CampusCribs (bell, inbox, badges).
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">Messages</Label>
                <p className="text-xs text-black/50 mt-1">
                  Show notifications for new DMs.
                </p>
              </div>
              <Switch
                checked={settings.webMessages}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, webMessages: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">Contact requests</Label>
                <p className="text-xs text-black/50 mt-1">
                  Notify when someone requests your contact info.
                </p>
              </div>
              <Switch
                checked={settings.webContactRequests}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, webContactRequests: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">System</Label>
                <p className="text-xs text-black/50 mt-1">
                  Post status, verification, important updates inside the app.
                </p>
              </div>
              <Switch
                checked={settings.webSystem}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, webSystem: v }))
                }
              />
            </div>

            <p className="text-xs text-black/45">
              Tip: these don’t affect whether you can receive messages—only
              whether CampusCribs shows notification alerts in the UI.
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="px-5 py-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-black/90">Email</h2>
            <p className="text-sm text-black/60">
              Notifications sent to your inbox.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">Security alerts</Label>
                <p className="text-xs text-black/50 mt-1">
                  Login alerts, password/email changes, suspicious activity.
                </p>
              </div>
              <Switch
                checked={settings.emailSecurityAlerts}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, emailSecurityAlerts: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">Product updates</Label>
                <p className="text-xs text-black/50 mt-1">
                  Feature launches and improvements.
                </p>
              </div>
              <Switch
                checked={settings.emailProductUpdates}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, emailProductUpdates: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">Marketing</Label>
                <p className="text-xs text-black/50 mt-1">
                  Occasional promotions, tips, and offers.
                </p>
              </div>
              <Switch
                checked={settings.emailMarketing}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, emailMarketing: v }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
