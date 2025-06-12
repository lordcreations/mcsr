'use client'
import BrazilMap from '@/components/BrazilMap';
import { StateSidebar } from '@/components/StateSidebar';
import { useState } from 'react';

export default function HomePage() {
  const [selectedStateName, setSelectedStateName] = useState<string>('Brasil');

  return (
    <div className="flex h-screen bg-black">
      <StateSidebar selectedStateName={selectedStateName} />

      {/* Map */}
      <div className="flex-1">
        <BrazilMap selectedStateName={selectedStateName} setSelectedStateName={setSelectedStateName} />
      </div>
    </div>
  );
}
