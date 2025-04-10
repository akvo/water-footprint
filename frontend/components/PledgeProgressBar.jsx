function PledgeProgressBar({ actual, target = 100, color = '#0DA2D7' }) {
  const percentage = Math.min(Math.max(actual, 0), 100);

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <div>
          <div className="text-gray-500 text-sm font-bold">ACTUAL</div>
          <div className="font-bold" style={{ color }}>
            {percentage}%
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-500 text-sm font-bold">TARGET</div>
          <div className="text-gray-700 font-bold">{target}%</div>
        </div>
      </div>
      <div className="h-6 bg-gray-200 rounded-md overflow-hidden">
        <div
          className="h-full rounded-md"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
}

export default PledgeProgressBar;
