import type { Metadata } from 'next';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import './style.css';
export const metadata: Metadata = { title: 'formaScience Gaming', description: 'Choisissez un jeu pour réviser les sciences de la santé.' };
export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="fr"><body>{children}</body></html>;
}
