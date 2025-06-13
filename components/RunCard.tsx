import { Run } from '@/lib/mockRuns';

interface RunCardProps {
  run: Run;
  index: number;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  // YYYY-MM-DD
  return date.toISOString().split('T')[0].split('-').reverse().join('/');
};

export const RunCard = ({ run, index }: RunCardProps) => {
  return (
    <div className="flex items-center p-3 bg-gray-700 rounded-lg mb-2">
      <div className="w-8 text-center font-mono font-bold text-gray-300">
        {index + 1}.
      </div>
      <div className="flex-1 ml-2">
        <div className="flex justify-between items-center">
          <span className="font-medium text-white">{run.playerName}</span>
          <span className="font-mono text-yellow-400">{run.time}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span className="uppercase">{run.state}</span>
          <span>{formatDate(run.date)}</span>
        </div>
      </div>
      {!run.verified && (
        <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-yellow-900 text-xs rounded-full">
          Inverificável
        </span>
      )}
    </div>
  );
};
