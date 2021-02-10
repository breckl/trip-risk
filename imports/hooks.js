import { useState, useEffect } from "react";
import localforage from "localforage";

function checkForIOS() {
  if (navigator.standalone) {
    return false;
  }
  const ua = window.navigator.userAgent;
  const webkit = !!ua.match(/WebKit/i);
  const isIPad = !!ua.match(/iPad/i);
  const isIPhone = !!ua.match(/iPhone/i);
  const isIOS = isIPad || isIPhone;
  const isSafari = isIOS && webkit && !ua.match(/CriOS/i);

  const prompt = isIOS && isSafari;

  return { isIOS, isSafari, prompt };
}

export default function useIsIOS() {
  const [isIOS, setIsIOS] = useState({});

  useEffect(() => {
    setIsIOS(checkForIOS());
    return () => console.log("CLEANUP INSTALL PROMPT", isIOS);
  }, []);

  return isIOS;
}
