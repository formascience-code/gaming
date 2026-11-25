import type { Metadata } from 'next';
import AcidGame from './game';

export const metadata: Metadata = {
  title: 'UE1 - Équilibre acido-basique · formaScience Gaming',
};

export default function AcidPage() {
  return <AcidGame/>;
}
