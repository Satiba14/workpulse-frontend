import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const sampleData = [
  { name: 'Engineering', billable: 68, nonBillable: 14, bufferPercent: 10.2 },
  { name: 'Sales', billable: 38, nonBillable: 6, bufferPercent: 5.3 },
  { name: 'Design', billable: 18, nonBillable: 5, bufferPercent: 10.5 },
  { name: 'DevOps', billable: 15, nonBillable: 3, bufferPercent: 10.5 },
  { name: 'QA', billable: 16, nonBillable: 4, bufferPercent: 7.3 },
  { name: 'Finance', billable: 10, nonBillable: 5, bufferPercent: 18.2 },
  { name: 'HR', billable: 6, nonBillable: 4, bufferPercent: 10.2 },
  { name: 'Product', billable: 15, nonBillable: 3, bufferPercent: 10.2 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl">
        <p className="font-bold text-gray-800 dark:text-gray-100 mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-6 mb-1">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{entry.name}:</span>
            <span style={{ color: entry.color }} className="text-sm font-bold">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BufferBillingChart = ({ data = sampleData }) => {
  return (
    <div className="w-full min-h-[480px] h-auto bg-white dark:bg-gray-900 pt-6 pb-6 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
          barGap={2} 
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#6b7280" strokeOpacity={0.2} />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
            dy={10} 
          />
          
          <YAxis 
            yAxisId="left" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            dx={-10}
            label={{ value: 'Counts', angle: -90, position: 'insideLeft', fill: '#6b7280', fontWeight: 600 }}
          />
          
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            dx={10}
            label={{ value: 'Percent', angle: 90, position: 'insideRight', fill: '#6b7280', fontWeight: 600 }}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: '#6b7280', opacity: 0.1 }} 
            allowEscapeViewBox={{ x: true, y: true }} 
            wrapperStyle={{ zIndex: 1000 }} 
          />
          
          <Legend 
            iconType="circle"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ bottom: 0 }}
          />
          
          <Bar 
            yAxisId="left" 
            dataKey="billable" 
            name="Billable" 
            stackId="a" 
            fill="#1d4ed8" 
            radius={[0, 0, 0, 0]} 
          />
          <Bar 
            yAxisId="left" 
            dataKey="nonBillable" 
            name="Non-Billable" 
            stackId="a" 
            fill="#f59e0b" 
            radius={[4, 4, 0, 0]} 
          />
          
          <Bar 
            yAxisId="right" 
            dataKey="bufferPercent" 
            name="Buffer %" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BufferBillingChart;