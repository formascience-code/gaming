import type { Metadata } from 'next';
import { gameTitle } from '../game-info';
import ProteinGame from '../protein-game';

export const metadata: Metadata = { title: `${gameTitle} | formaScience Gaming` };

export default function ProteinSynthesisPage() {
  return <ProteinGame />;
}
