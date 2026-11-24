import type { ReactNode } from 'react';

export function GameHeader({ title, children }: { title: string; children: ReactNode }) {
  return <header className="topbar">
    <div className="gaming-brand">
      {/* The original logo is served directly so the game can be exported as static files. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/forma-science-logo.png" alt="formaScience Strasbourg"/>
      <span className="gaming-label">GAMING</span>
    </div>
    <h1 className="game-title">{title}</h1>
    <div className="top-tools">{children}</div>
  </header>;
}
