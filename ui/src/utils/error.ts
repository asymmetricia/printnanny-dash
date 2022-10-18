import { useAlertStore } from "@/stores/alerts";
import type { UiStickyAlert, AlertAction } from "@/types";

function handleError(header: string, e: Error) {
  console.error(e);
  const message = e.message || e.toString();
  const actions = [
    {
      color: "red",
      text: "Refresh",
      onClick: () => {
        window.location.reload();
      },
    },
  ] as Array<AlertAction>;
  const alert: UiStickyAlert = {
    header,
    message,
    actions,
    error: e,
  };
  const store = useAlertStore();
  store.pushAlert(alert);
}

function alertMessage(header: string, message: string) {
  const actions = [
    {
      color: "amber",
      text: "Refresh Page",
      onClick: () => {
        window.location.reload();
      },
    },
  ] as Array<AlertAction>;
  const alert: UiStickyAlert = {
    header,
    message,
    actions,
    error: undefined,
  };
  const store = useAlertStore();
  store.pushAlert(alert);
}

export { handleError };
