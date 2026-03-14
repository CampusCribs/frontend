import { useEffect, useState } from "react";
import { useGetPrivacySettings, usePostPrivacySettings } from "@/gen";
import { useNotify } from "@/components/ui/Notify";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

type PrivacySettingsState = {
  hidePostFromUnverified: boolean;
  allowMessagesFromVerifiedOnly: boolean;
  allowContactRequests: boolean;
  blurPhotosUntilVerified: boolean;
  hideExactLocation: boolean;
  showOnlyCampus: boolean;
  hideLastName: boolean;
  hideContactInfo: boolean;
  marketingEmails: boolean;
  marketingSms: boolean;
  personalizedAds: boolean;
};

export default function PrivacySettingsPage() {
  const navigate = useNavigate();
  const notify = useNotify();
  const config = useAuthenticatedClientConfig();
  const { data, isLoading, isError } = useGetPrivacySettings({
    client: config,
  });
  const { mutateAsync: savePrivacySettings, isPending } = usePostPrivacySettings(
    {
      client: config,
    },
  );

  const [settings, setSettings] = useState<PrivacySettingsState>({
    hidePostFromUnverified: false,
    allowMessagesFromVerifiedOnly: false,
    allowContactRequests: true,
    blurPhotosUntilVerified: false,
    hideExactLocation: true,
    showOnlyCampus: true,
    hideLastName: false,
    hideContactInfo: false,
    marketingEmails: false,
    marketingSms: false,
    personalizedAds: true,
  });
  const [initialSettings, setInitialSettings] =
    useState<PrivacySettingsState | null>(null);

  useEffect(() => {
    const nextSettings = data?.data.privacy;
    if (!nextSettings) return;
    setSettings(nextSettings);
    setInitialSettings(nextSettings);
  }, [data]);

  const isDirty =
    initialSettings !== null &&
    JSON.stringify(settings) !== JSON.stringify(initialSettings);

  const onSave = async () => {
    try {
      const response = await savePrivacySettings({
        data: settings,
      });
      setSettings(response.data.privacy);
      setInitialSettings(response.data.privacy);

      await notify({
        title: "Saved",
        message: "Your privacy settings have been updated.",
        buttonText: "Close",
      });
    } catch (error: any) {
      await notify({
        title: "Unable to save",
        message:
          error?.response?.data?.detail ||
          "Please try again in a moment.",
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

        <h1 className="text-xl font-semibold text-black/90">
          Privacy &amp; Safety
        </h1>
      </div>

      {isLoading && (
        <div className="px-5 pt-4 text-sm text-black/55">
          Loading privacy settings...
        </div>
      )}
      {isError && (
        <div className="px-5 pt-4 text-sm text-red-600">
          Unable to load privacy settings.
        </div>
      )}

      <div className="mt-4 border-t">
        <Section
          title="Who can interact"
          description="Control who can view, message, and request contact."
        >
          <SettingRow
            label="Hide posts from non-verified users"
            description="Only verified users can view your listings."
            checked={settings.hidePostFromUnverified}
            onCheckedChange={(v) =>
              setSettings((s) => ({ ...s, hidePostFromUnverified: v }))
            }
          />
          <SettingRow
            label="Messages from verified users only"
            description="Reduce spam by restricting DMs to verified accounts."
            checked={settings.allowMessagesFromVerifiedOnly}
            onCheckedChange={(v) =>
              setSettings((s) => ({
                ...s,
                allowMessagesFromVerifiedOnly: v,
              }))
            }
          />
          <SettingRow
            label="Allow contact requests"
            description="Let others request your contact info (if you choose to show it)."
            checked={settings.allowContactRequests}
            onCheckedChange={(v) =>
              setSettings((s) => ({ ...s, allowContactRequests: v }))
            }
          />
          <SettingRow
            label="Blur photos until verified"
            description="Unverified users see blurred images on your posts."
            checked={settings.blurPhotosUntilVerified}
            onCheckedChange={(v) =>
              setSettings((s) => ({ ...s, blurPhotosUntilVerified: v }))
            }
          />
        </Section>

        <Section
          title="What you share"
          description="Choose which profile/location details appear publicly."
        >
          <SettingRow
            label="Hide exact location"
            description="Show an approximate area instead of a precise pin."
            checked={settings.hideExactLocation}
            onCheckedChange={(v) =>
              setSettings((s) => ({ ...s, hideExactLocation: v }))
            }
          />
          <SettingRow
            label="Show only campus"
            description="Display your campus/market, not your broader city."
            checked={settings.showOnlyCampus}
            onCheckedChange={(v) =>
              setSettings((s) => ({ ...s, showOnlyCampus: v }))
            }
          />
          <SettingRow
            label="Hide last name"
            description="Only show your first name publicly."
            checked={settings.hideLastName}
            onCheckedChange={(v) =>
              setSettings((s) => ({ ...s, hideLastName: v }))
            }
          />
          <SettingRow
            label="Hide contact info"
            description="Hide phone/email from your public profile and listings."
            checked={settings.hideContactInfo}
            onCheckedChange={(v) =>
              setSettings((s) => ({ ...s, hideContactInfo: v }))
            }
          />
        </Section>

        <Section
          title="Marketing"
          description="Control promotions, product updates, and personalization."
          bordered={false}
        >
          <SettingRow
            label="Marketing emails"
            description="Occasional promos, tips, and feature updates."
            checked={settings.marketingEmails}
            onCheckedChange={(v) =>
              setSettings((s) => ({ ...s, marketingEmails: v }))
            }
          />
          <SettingRow
            label="Marketing texts (SMS)"
            description="Promotions sent to your phone number (carrier rates may apply)."
            checked={settings.marketingSms}
            onCheckedChange={(v) =>
              setSettings((s) => ({ ...s, marketingSms: v }))
            }
          />
        </Section>
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

function Section({
  title,
  description,
  children,
  bordered = true,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <div className={bordered ? "border-b px-5 py-5" : "px-5 py-5"}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-black/90">{title}</h2>
        <p className="text-sm text-black/60">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
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
