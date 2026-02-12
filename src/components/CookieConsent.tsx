"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "simulador-economia-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent !== "accepted") {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-5 bg-slate-900/95 dark:bg-slate-950/95 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 id="cookie-title" className="font-semibold text-slate-100 mb-1">
            Uso de cookies
          </h2>
          <p id="cookie-desc" className="text-sm text-slate-300">
            Utilizamos cookies propias y de terceros para el correcto funcionamiento del sitio y para guardar tu preferencia de cookies. 
            No recopilamos datos personales. Puedes revisar nuestro{" "}
            <Link href="/aviso-privacidad" className="underline hover:text-blue-300 transition-colors">
              aviso de privacidad
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={accept}
          className="flex-shrink-0 w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Aceptar cookies
        </button>
      </div>
    </div>
  );
}
