import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatHourlyTime } from '../../utils/timeUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div
      className="rounded-xl px-4 py-3 backdrop-blur-xl border border-white/10 shadow-xl"
      style={{
        background: 'rgba(13, 17, 23, 0.95)',
      }}
    >
      <p className="text-xs font-semibold mb-2 text-white/60">
        {formatHourlyTime(data.time)}
      </p>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-white/50">
            Temp
          </span>
          <span className="text-sm font-bold tabular-nums text-white">
            {data.temp != null ? `${Math.round(data.temp)}°` : '--'}
          </span>
        </div>

        {data.feelsLike != null && (
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs text-white/50">
              Feels like
            </span>
            <span className="text-xs font-semibold tabular-nums text-white/70">
              {Math.round(data.feelsLike)}°
            </span>
          </div>
        )}

        {data.precipProb != null && data.precipProb > 0 && (
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs text-white/50">
              Precip
            </span>
            <span className="text-xs font-semibold tabular-nums text-blue-400">
              {data.precipProb}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const ForecastChart = ({ hourlyData }) => {
  const chartData = useMemo(() => {
    if (!hourlyData || hourlyData.length === 0) return [];
    return hourlyData.map((h) => ({
      time: h.time,
      temp: h.temp,
      feelsLike: h.feelsLike,
      precipProb: h.precipProb,
    }));
  }, [hourlyData]);

  if (chartData.length === 0) return null;

  const gradientId = 'tempGradient';
  const lineColor = '#22d3ee';

  const temps = chartData.map((d) => d.temp).filter((t) => t != null);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const padding = (maxTemp - minTemp) * 0.15 || 2;

  return (
    <div
      className="backdrop-blur-xl rounded-2xl border border-white/10 p-4 md:p-5"
      style={{
        background: 'rgba(255,255,255,0.04)',
      }}
    >
      <h3 className="text-sm font-semibold tracking-wide uppercase mb-4 text-white/50">
        Temperature Trend
      </h3>

      <div className="h-48 md:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              tickFormatter={formatHourlyTime}
              tick={{
                fontSize: 10,
                fill: 'rgba(255,255,255,0.3)',
              }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={40}
            />

            <YAxis
              domain={[minTemp - padding, maxTemp + padding]}
              tick={{
                fontSize: 10,
                fill: 'rgba(255,255,255,0.3)',
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${Math.round(v)}°`}
              width={36}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: 'rgba(255,255,255,0.08)',
                strokeWidth: 1,
              }}
            />

            <Area
              type="monotone"
              dataKey="temp"
              stroke={lineColor}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 5,
                fill: lineColor,
                stroke: '#0d1117',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export { ForecastChart };
