import { useState, useEffect } from 'react';

interface MetricCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  label: string;
}

export function MetricCounter({ value, prefix = "", suffix = "", duration = 1200, label }: MetricCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  // Format helper
  const formatNumber = (num: number) => {
    if (num >= 100000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  return (
    <div className="flex flex-col">
      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
        {prefix}{formatNumber(count)}{suffix}
      </span>
      <span className="text-xs text-gray-400 font-medium uppercase mt-1 tracking-wider">
        {label}
      </span>
    </div>
  );
}
