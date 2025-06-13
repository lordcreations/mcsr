'use client'
import BrazilMap from '@/components/BrazilMap';
import { StateSidebar } from '@/components/StateSidebar';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function HomePage() {
  const [selectedStateName, setSelectedStateName] = useState<string>('Brasil');
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex h-screen" />;
  }

  return (
    <div className={`flex h-screen ${resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <StateSidebar selectedStateName={selectedStateName} />

      {/* Map */}
      <div className="flex-1">
        <BrazilMap selectedStateName={selectedStateName} setSelectedStateName={setSelectedStateName} />
      </div>
    </div>
  );
}
