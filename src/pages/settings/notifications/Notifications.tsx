import { useEffect, useState } from "react";
import { useGetNotificationSettings, usePostNotificationSettings } from "@/gen";
import { useNotify } from "@/components/ui/Notify";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

type NotificationSettingsState = {
  webMessages: boolean;
  webContactRequests: boolean;
  webSystem: boolean;
  emailSecurityAlerts: boolean;
  emailProductUpdates: boolean;
  emailMarketing: boolean;
};

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const notify = useNotify();
  const config = useAuthenticatedClientConfig();
  const { data, isLoading, isError } = useGetNotificationSettings({});
  const { mutateAsync: saveNotificationSettings, isPending } =
    usePostNotificationSettings({});

  const [settings, setSettings] = useState<NotificationSettingsState>({
    webMessages: true,
    webContactRequests: true,
    webSystem: true,
    emailSecurityAlerts: true,
    emailProductUpdates: true,
    emailMarketing: false,
  });
  const [initialSettings, setInitialSettings] =
    useState<NotificationSettingsState | null>(null);

  useEffect(() => {
    const nextSettings = data?.data.notifications;
    if (!nextSettings) return;
    setSettings(nextSettings);
    setInitialSettings(nextSettings);
  }, [data]);

  const isDirty =
    initialSettings !== null &&
    JSON.stringify(settings) !== JSON.stringify(initialSettings);

  const onSave = async () => {
    try {
      const response = await saveNotificationSettings({
        data: settings,
      });
      setSettings(response.data.notifications);
      setInitialSettings(response.data.notifications);

      await notify({
        title: "Saved",
        message: "Your notification settings have been updated.",
        buttonText: "Close",
      });
    } catch (error: any) {
      await notify({
        title: "Unable to save",
        message:
          error?.response?.data?.detail || "Please try again in a moment.",
        buttonText: "Close",
      });
    }
  };

  return (
    <div className="mx-auto min-h-[100dvh] bg-white">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button
          title="back"
          onClick={() => navigate(-1)}
          className="rounded-full p-2 transition hover:bg-black/5"
          type="button"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-xl font-semibold text-black/90">Notifications</h1>
      </div>

      {isLoading && (
        <div className="px-5 pt-4 text-sm text-black/55">
          Loading notifications...
        </div>
      )}
      {isError && (
        <div className="px-5 pt-4 text-sm text-red-600">
          Unable to load notification settings.
        </div>
      )}

      <div className="mt-4 border-t">
        <div className="border-b px-5 py-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-black/90">In-web</h2>
            <p className="text-sm text-black/60">
              Notifications you see inside CampusCribs (bell, inbox, badges).
            </p>
          </div>

          <div className="space-y-5">
            <SettingRow
              label="Messages"
              description="Show notifications for new DMs."
              checked={settings.webMessages}
              onCheckedChange={(v) =>
                setSettings((s) => ({ ...s, webMessages: v }))
              }
            />

            <SettingRow
              label="Contact requests"
              description="Notify when someone requests your contact info."
              checked={settings.webContactRequests}
              onCheckedChange={(v) =>
                setSettings((s) => ({ ...s, webContactRequests: v }))
              }
            />

            <SettingRow
              label="System"
              description="Post status, verification, important updates inside the app."
              checked={settings.webSystem}
              onCheckedChange={(v) =>
                setSettings((s) => ({ ...s, webSystem: v }))
              }
            />

            <p className="text-xs text-black/45">
              Tip: these do not affect whether you can receive messages, only
              whether CampusCribs shows notification alerts in the UI.
            </p>
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-black/90">Email</h2>
            <p className="text-sm text-black/60">
              Notifications sent to your inbox.
            </p>
          </div>

          <div className="space-y-5">
            <SettingRow
              label="Security alerts"
              description="Login alerts, password/email changes, suspicious activity."
              checked={settings.emailSecurityAlerts}
              onCheckedChange={(v) =>
                setSettings((s) => ({ ...s, emailSecurityAlerts: v }))
              }
            />

            <SettingRow
              label="Product updates"
              description="Feature launches and improvements."
              checked={settings.emailProductUpdates}
              onCheckedChange={(v) =>
                setSettings((s) => ({ ...s, emailProductUpdates: v }))
              }
            />

            <SettingRow
              label="Marketing"
              description="Occasional promotions, tips, and offers."
              checked={settings.emailMarketing}
              onCheckedChange={(v) =>
                setSettings((s) => ({ ...s, emailMarketing: v }))
              }
            />
          </div>
        </div>
      </div>

      <div className="px-5 pb-6">
        <button
          type="button"
          disabled={isPending || !isDirty || isLoading}
          onClick={onSave}
          className="mt-2 w-full rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <Label className="cursor-pointer">{label}</Label>
        <p className="mt-1 text-xs text-black/50">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
