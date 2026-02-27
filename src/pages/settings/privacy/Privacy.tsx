import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function PrivacySettingsPage() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    // Privacy & safety
    hidePostFromUnverified: false,
    allowMessagesFromVerifiedOnly: false,
    allowContactRequests: true,
    blurPhotosUntilVerified: false,

    // What you show
    hideExactLocation: true,
    showOnlyCampus: true,
    hideLastName: false,
    hideContactInfo: false,

    // Marketing (requested)
    marketingEmails: false,
    marketingSms: false,
    personalizedAds: true,
  });

  return (
    <div className="mx-auto min-h-[100dvh] bg-white">
      {/* Header (match Settings look) */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <button
          title="back"
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-black/5 transition"
          type="button"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-xl font-semibold text-black/90">
          Privacy &amp; Safety
        </h1>
      </div>

      <div className="mt-4 border-t">
        {/* Section: Who can interact */}
        <div className="px-5 py-5 border-b">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-black/90">
              Who can interact
            </h2>
            <p className="text-sm text-black/60">
              Control who can view, message, and request contact.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">
                  Hide posts from non-verified users
                </Label>
                <p className="text-xs text-black/50 mt-1">
                  Only verified users can view your listings.
                </p>
              </div>
              <Switch
                checked={settings.hidePostFromUnverified}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, hidePostFromUnverified: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">
                  Messages from verified users only
                </Label>
                <p className="text-xs text-black/50 mt-1">
                  Reduce spam by restricting DMs to verified accounts.
                </p>
              </div>
              <Switch
                checked={settings.allowMessagesFromVerifiedOnly}
                onCheckedChange={(v) =>
                  setSettings((s) => ({
                    ...s,
                    allowMessagesFromVerifiedOnly: v,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">Allow contact requests</Label>
                <p className="text-xs text-black/50 mt-1">
                  Let others request your contact info (if you choose to show
                  it).
                </p>
              </div>
              <Switch
                checked={settings.allowContactRequests}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, allowContactRequests: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">
                  Blur photos until verified
                </Label>
                <p className="text-xs text-black/50 mt-1">
                  Unverified users see blurred images on your posts.
                </p>
              </div>
              <Switch
                checked={settings.blurPhotosUntilVerified}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, blurPhotosUntilVerified: v }))
                }
              />
            </div>
          </div>
        </div>

        {/* Section: What you show */}
        <div className="px-5 py-5 border-b">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-black/90">
              What you share
            </h2>
            <p className="text-sm text-black/60">
              Choose which profile/location details appear publicly.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">Hide exact location</Label>
                <p className="text-xs text-black/50 mt-1">
                  Show an approximate area instead of a precise pin.
                </p>
              </div>
              <Switch
                checked={settings.hideExactLocation}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, hideExactLocation: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">Show only campus</Label>
                <p className="text-xs text-black/50 mt-1">
                  Display your campus/market, not your broader city.
                </p>
              </div>
              <Switch
                checked={settings.showOnlyCampus}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, showOnlyCampus: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">Hide last name</Label>
                <p className="text-xs text-black/50 mt-1">
                  Only show your first name publicly.
                </p>
              </div>
              <Switch
                checked={settings.hideLastName}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, hideLastName: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">Hide contact info</Label>
                <p className="text-xs text-black/50 mt-1">
                  Hide phone/email from your public profile and listings.
                </p>
              </div>
              <Switch
                checked={settings.hideContactInfo}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, hideContactInfo: v }))
                }
              />
            </div>
          </div>
        </div>

        {/* Section: Marketing */}
        <div className="px-5 py-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-black/90">Marketing</h2>
            <p className="text-sm text-black/60">
              Control promotions, product updates, and personalization.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">Marketing emails</Label>
                <p className="text-xs text-black/50 mt-1">
                  Occasional promos, tips, and feature updates.
                </p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, marketingEmails: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">Marketing texts (SMS)</Label>
                <p className="text-xs text-black/50 mt-1">
                  Promotions sent to your phone number (carrier rates may
                  apply).
                </p>
              </div>
              <Switch
                checked={settings.marketingSms}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, marketingSms: v }))
                }
              />
            </div>

            {/* <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label className="cursor-pointer">Personalized ads</Label>
                <p className="text-xs text-black/50 mt-1">
                  Use your activity to personalize ads and recommendations.
                </p>
              </div>
              <Switch
                checked={settings.personalizedAds}
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, personalizedAds: v }))
                }
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
