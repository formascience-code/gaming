import type { Metadata } from 'next';
import MetabolismGame from './game';
import { metabolismTitle } from './questions';

export const metadata: Metadata = { title: `${metabolismTitle} | formaScience Gaming` };

export default function MetabolismPage() {
  return <MetabolismGame/>;
}
