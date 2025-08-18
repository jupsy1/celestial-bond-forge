import { useEffect, useState } from "react";
import {
  detectInAppBrowser,
  inAppPrettyName,
  inAppHelpMessage,
  type InAppApp,
} from "@/utils/inAppDetector";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";

const InAppWarning = () => {
  const [inApp, setInApp] = useState<InAppApp>(null);

  useEffect(() => {
    setInApp(detectInAppBrowser());
  }, []);

  if (!inApp) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      alert("Link copied. Paste it in Safari (iPhone) or Chrome (Android).");
    } catch {
      alert("Couldn’t copy. Long-press the address bar to copy manually.");
    }
  };

  const chromeIntentHref =
    `intent://${window.location.host}${window.location.pathname}${window.location.search}` +
    `#Intent;package=com.android.chrome;scheme=https;end;`;

  return (
    <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-100 mb-4">
      <p className="mb-2">
        You’re viewing this inside <b>{inAppPrettyName(inApp)}</b>’s in-app browser.
        {" "}{inAppHelpMessage(inApp)}
      </p>
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" onClick={copyLink}>
          <LinkIcon className="h-4 w-4 mr-2" /> Copy link
        </Button>
        {/* Android only: often jumps out of the WebView into real Chrome */}
        <a
          href={chromeIntentHref}
          className="inline-flex items-center rounded-md border px-3 py-2"
        >
          Open in Chrome
        </a>
      </div>
    </div>
  );
};

export default InAppWarning;
