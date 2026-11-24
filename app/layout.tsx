import type { Metadata } from 'next';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import './style.css';
import { gameTitle } from './game-info';
export const metadata: Metadata = { title: `${gameTitle} | formaScience Gaming`, description: 'Explorez une coupe interactive de cellule animale.' };
export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="fr"><body>{children}</body></html>;
}
