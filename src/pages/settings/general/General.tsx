import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeftIcon } from "lucide-react";
import React, { useState } from "react";

const General = () => {
  const [settings, setSettings] = useState({
    hidePostFromUnverified: false,
    hideExactLocation: true,
    hideLastName: false,
    hideContactInfo: false,
    allowContactRequests: true,
    allowMessagesFromVerifiedOnly: false,
    showOnlyCampus: true,
    blurPhotosUntilVerified: false,
  });
  return (
    <div>
      <div className="px-3 pt-3">
        <div
          onClick={() => window.history.back()}
          className="cursor-pointer inline-flex items-center"
        >
          <ArrowLeftIcon size={32} />
          <span className="ml-2">Back</span>
        </div>
      </div>
      <div className="flex items-center justify-center text-xl font-semibold mt-5">
        General Settings
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-md px-5 py-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="text-sm font-semibold text-slate-900">Privacy</div>
            <p className="text-xs text-slate-500 mt-1">
              Control who can see your post and what details are shown.
            </p>

            <div className="mt-5 space-y-5">
              {/* Hide post from non-verified */}
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Label className="cursor-pointer">
                    Hide post from non-verified users
                  </Label>
                  <p className="text-xs text-slate-500 mt-1">
                    Only verified users can view your listing.
                  </p>
                </div>
                <Switch
                  checked={settings.hidePostFromUnverified}
                  onCheckedChange={(v) =>
                    setSettings((s) => ({ ...s, hidePostFromUnverified: v }))
                  }
                />
              </div>

              {/* Hide exact location */}
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Label className="cursor-pointer">Hide exact location</Label>
                  <p className="text-xs text-slate-500 mt-1">
                    Show an approximate area instead of the exact pin.
                  </p>
                </div>
                <Switch
                  checked={settings.hideExactLocation}
                  onCheckedChange={(v) =>
                    setSettings((s) => ({ ...s, hideExactLocation: v }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;
