import { useSyncExternalStore } from "react";

const subscribe = (callBack: () => void) => {
  window.addEventListener('online', callBack)
  window.addEventListener('offline', callBack)

  return () => {
    window.removeEventListener('online', callBack)
    window.removeEventListener('offline', callBack)
  }
}

const getSnapshot = () => {
  return navigator.onLine
}

export default function useMyNetworkState() {
  const online = useSyncExternalStore(subscribe, getSnapshot)

  return online
}