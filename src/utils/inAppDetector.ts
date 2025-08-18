import { useEffect, useState } from "react";
import { detectInAppBrowser, inAppPrettyName, inAppHelpMessage } from "@/utils/inAppDetector";

const InAppWarning = () => {
  const [inApp, setInApp] = useState<ReturnType<typeof detectInAppBrowser>>(null);

  useEffect(() => {
    setInApp(detectInAppBrowser());
  }, []);

  if (!inApp) return null;

  return (
    <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-100 mb-4">
      You’re viewing this inside <b>{inAppPrettyName(inApp)}</b>’s in-app browser.{" "}
      {inAppHelpMessage(inApp)}
    </div>
  );
};

export default InAppWarning;
