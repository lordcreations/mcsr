import BrazilMap from '@/components/BrazilMap';
import { StateSidebar } from '@/components/StateSidebar';

export default function HomePage() {
  return (
    <div className="flex h-screen bg-black">
      <StateSidebar />

      {/* Map */}
      <div className="flex-1">
        <BrazilMap />
      </div>
    </div>
  );
}
