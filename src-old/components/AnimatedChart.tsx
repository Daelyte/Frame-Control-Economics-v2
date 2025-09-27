"use client";
import { motion as m, useInView } from "framer-motion";
import { useRef, useMemo } from "react";

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AnimatedChartProps {
  data: DataPoint[];
  type?: 'bar' | 'line' | 'progress';
  width?: number;
  height?: number;
  className?: string;
}

export default function AnimatedChart({ 
  data, 
  type = 'bar', 
  width = 400, 
  height = 300,
  className = ""
}: AnimatedChartProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const maxValue = Math.max(...data.map(d => d.value));
  const chartPadding = { top: 20, right: 20, bottom: 40, left: 40 };
  
  const chartWidth = width - chartPadding.left - chartPadding.right;
  const chartHeight = height - chartPadding.top - chartPadding.bottom;

  if (type === 'progress') {
    return (
      <div ref={ref} className={`space-y-4 ${className}`}>
        {data.map((item, i) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-primary)' }}>
                {item.label}
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {item.value}%
              </span>
            </div>
            
            <div 
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--surface-200)' }}
            >
              <m.div
                className="h-full rounded-full"
                style={{
                  background: item.color || `var(--brand-${500 + i * 100})`
                }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${item.value}%` } : { width: 0 }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-400)" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="var(--brand-600)" stopOpacity="0.2"/>
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <g transform={`translate(${chartPadding.left}, ${chartPadding.top})`}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <m.line
              key={i}
              x1={0}
              x2={chartWidth}
              y1={chartHeight * ratio}
              y2={chartHeight * ratio}
              stroke="var(--surface-300)"
              strokeWidth="0.5"
              strokeOpacity="0.5"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
          ))}
        </g>

        {/* Data visualization */}
        <g transform={`translate(${chartPadding.left}, ${chartPadding.top})`}>
          {type === 'bar' && data.map((item, i) => {
            const barWidth = chartWidth / data.length * 0.6;
            const barX = (i * chartWidth / data.length) + (chartWidth / data.length - barWidth) / 2;
            const barHeight = (item.value / maxValue) * chartHeight;
            const barY = chartHeight - barHeight;

            return (
              <g key={item.label}>
                <m.rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#chartGradient)"
                  rx="4"
                  initial={{ height: 0, y: chartHeight }}
                  animate={isInView ? 
                    { height: barHeight, y: barY } : 
                    { height: 0, y: chartHeight }
                  }
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                />
                
                {/* Bar labels */}
                <m.text
                  x={barX + barWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="var(--text-secondary)"
                  initial={{ opacity: 0, y: chartHeight + 30 }}
                  animate={isInView ? 
                    { opacity: 1, y: chartHeight + 20 } : 
                    { opacity: 0, y: chartHeight + 30 }
                  }
                  transition={{ delay: i * 0.1 + 0.4, duration: 0.5 }}
                >
                  {item.label}
                </m.text>
              </g>
            );
          })}

          {type === 'line' && (
            <>
              {/* Line path */}
              <m.path
                d={`M ${data.map((item, i) => {
                  const x = (i * chartWidth) / (data.length - 1);
                  const y = chartHeight - (item.value / maxValue) * chartHeight;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}`}
                stroke="var(--brand-500)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />

              {/* Data points */}
              {data.map((item, i) => {
                const x = (i * chartWidth) / (data.length - 1);
                const y = chartHeight - (item.value / maxValue) * chartHeight;
                
                return (
                  <m.circle
                    key={item.label}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="var(--brand-500)"
                    stroke="white"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 1.5 + i * 0.1, duration: 0.3 }}
                  />
                );
              })}
            </>
          )}
        </g>

        {/* Y-axis labels */}
        <g transform={`translate(${chartPadding.left - 10}, ${chartPadding.top})`}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <m.text
              key={i}
              x={0}
              y={chartHeight * ratio + 4}
              textAnchor="end"
              fontSize="10"
              fill="var(--text-secondary)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {Math.round((1 - ratio) * maxValue)}
            </m.text>
          ))}
        </g>
      </svg>
    </div>
  );
}