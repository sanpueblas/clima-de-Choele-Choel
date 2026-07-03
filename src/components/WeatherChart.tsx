import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchHistoryClient } from '../api';

interface ChartDataPoint {
  time: string;
  temp: number;
  humidity: number;
}

export default function WeatherChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const obsArray = await fetchHistoryClient();
        
        const recentObs = obsArray.slice(-24);
        const formattedData: ChartDataPoint[] = recentObs.map((obs: any) => {
          const timeStr = obs.obsTimeLocal ? obs.obsTimeLocal.split(' ')[1] : "00:00:00";
          const hour = timeStr.split(':')[0];
          return {
            time: `${hour}:00`,
            temp: obs.metric?.tempAvg ?? obs.metric?.tempHigh ?? 0,
            humidity: obs.humidityAvg ?? obs.humidityHigh ?? 0,
          };
        });
        
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-indigo-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-200"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-8 border-t border-white/10">
      <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        Historial de Temperatura (Últimas 24hs)
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.5)" 
              tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}}
              tickMargin={10}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}}
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(30, 27, 75, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff' }}
              itemStyle={{ color: '#818cf8' }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem' }}
              formatter={(value: number) => [`${value}°C`, 'Temperatura']}
            />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#818cf8" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              activeDot={{ r: 6, fill: '#fff', stroke: '#818cf8', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
