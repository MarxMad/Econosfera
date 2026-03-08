"use client";

/**
 * Layout del glosario con barras laterales XM (120x600) en pantallas grandes.
 * Estructura: [sidebar izq] [contenido] [sidebar der]
 */
const XM_SIDEBAR_LEFT = {
  href: "https://clicks.pipaffiliates.com/c?m=131855&c=744292",
  img: "https://ads.pipaffiliates.com/i/131855?c=744292",
  width: 120,
  height: 600,
};

const XM_SIDEBAR_RIGHT = {
  href: "https://clicks.pipaffiliates.com/c?m=131764&c=744292",
  img: "https://ads.pipaffiliates.com/i/131764?c=744292",
  width: 120,
  height: 600,
};

function SidebarAd({ href, img, width, height }: { href: string; img: string; width: number; height: number }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      referrerPolicy="no-referrer-when-downgrade"
      className="block"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        alt="XM"
        width={width}
        height={height}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </a>
  );
}

interface GlosarioAdLayoutProps {
  children: React.ReactNode;
  /** Si true, contenido estrecho (páginas de término). Si false, más ancho (listado). */
  compact?: boolean;
}

export default function GlosarioAdLayout({ children, compact = true }: GlosarioAdLayoutProps) {
  return (
    <div className="flex gap-6 justify-center">
      <aside className="hidden lg:block w-[120px] shrink-0 sticky top-24 self-start" aria-label="Promoción XM">
        <SidebarAd {...XM_SIDEBAR_LEFT} />
      </aside>
      <div className={`flex-1 min-w-0 ${compact ? "max-w-3xl" : "max-w-6xl"}`}>
        {children}
      </div>
      <aside className="hidden lg:block w-[120px] shrink-0 sticky top-24 self-start" aria-label="Promoción XM">
        <SidebarAd {...XM_SIDEBAR_RIGHT} />
      </aside>
    </div>
  );
}
