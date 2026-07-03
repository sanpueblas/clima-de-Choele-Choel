import { useEffect, useState, useRef } from "react";
import { 
  Cloud,
  CloudRain, 
  Droplets, 
  Gauge, 
  Sun, 
  Moon,
  Thermometer, 
  Wind, 
  RefreshCcw,
  Compass,
  ArrowDownCircle,
  Download,
  CloudLightning,
  CloudSnow,
  CloudSun,
  Activity,
  CalendarDays,
  Navigation,
  Share2,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { FormattedWeather, ForecastDay } from "./types";

import WeatherChart from './components/WeatherChart';
import { fetchWeatherClient, fetchForecastClient } from "./api";

export default function App() {
  const [weather, setWeather] = useState<FormattedWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'stats' | 'forecast'>('current');
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showShareMenu]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleEasterEggClick = () => {
    const newCount = easterEggClicks + 1;
    setEasterEggClicks(newCount);
    if (newCount >= 6) {
      setShowEasterEgg(true);
      setTimeout(() => {
        setShowEasterEgg(false);
        setEasterEggClicks(0);
      }, 4000);
    }
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherClient();
      
      const formatVal = (key: string) => {
        const val = data[key];
        return val && Array.isArray(val) ? val[1] : 0;
      };

      setWeather({
        timestamp: data.last_update ? data.last_update * 1000 : Date.now(),
        temp: formatVal('temp_current'),
        humidity: formatVal('hum_current'),
        dewPoint: formatVal('dew_current'),
        windChill: formatVal('chill_current'),
        pressure: formatVal('bar_current'),
        windSpeed: Math.round(formatVal('wspd_current') * 3.6 * 10) / 10,
        windGust: Math.round(formatVal('wspdhi_current') * 3.6 * 10) / 10,
        windAvg: Math.round(formatVal('wspdavg_current') * 3.6 * 10) / 10,
        windDirection: formatVal('wdir_current'),
        solarRad: formatVal('solarrad_current'),
        uvIndex: formatVal('uvi_current'),
        stats24h: {
          tempMax: formatVal('temp_day_max'),
          tempMin: formatVal('temp_day_min'),
          humMax: formatVal('hum_day_max'),
          humMin: formatVal('hum_day_min'),
          pressureMax: formatVal('bar_day_max'),
          pressureMin: formatVal('bar_day_min'),
          wspdMax: Math.round(formatVal('wspd_day_max') * 3.6 * 10) / 10,
          windGustMax: Math.round(formatVal('wspdhi_day_max') * 3.6 * 10) / 10,
        }
      });
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const days = await fetchForecastClient();
        if (days && days.length > 0) setForecast(days);
      } catch (e) {
        console.error("Error fetching forecast:", e);
      }
    };
    
    fetchWeather();
    fetchForecast();
    
    const interval = setInterval(fetchWeather, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getWindDirectionStr = (deg: number) => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return directions[Math.round(deg / 22.5) % 16] || "N";
  };

  const isNight = () => {
    const h = new Date().getHours();
    return h >= 19 || h < 7;
  };

  const getMoonPhaseInfo = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let c = 0, e = 0, jd = 0, b = 0;
    let m = month;
    let y = year;
    if (m < 3) {
      y--;
      m += 12;
    }
    ++m;
    c = 365.25 * y;
    e = 30.6 * m;
    jd = c + e + day - 694039.09; 
    jd /= 29.5305882; 
    b = Math.floor(jd); 
    jd -= b; 
    b = Math.round(jd * 8); 
    if (b >= 8) b = 0; 
    
    const phases = [
      "Luna Nueva",
      "Luna Creciente",
      "Cuarto Creciente",
      "Luna Gibosa Creciente",
      "Luna Llena",
      "Luna Gibosa Menguante",
      "Cuarto Menguante",
      "Luna Menguante"
    ];
    return phases[b];
  };

  const getMoonPhaseEmoji = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let c = 0, e = 0, jd = 0, b = 0;
    let m = month;
    let y = year;
    if (m < 3) {
      y--;
      m += 12;
    }
    ++m;
    c = 365.25 * y;
    e = 30.6 * m;
    jd = c + e + day - 694039.09; 
    jd /= 29.5305882; 
    b = Math.floor(jd); 
    jd -= b; 
    b = Math.round(jd * 8); 
    if (b >= 8) b = 0; 
    
    const emojis = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
    return emojis[b];
  };

  const getWeatherRecommendation = (w: FormattedWeather) => {
    const h = new Date().getHours();
    if (h < 7 || h >= 21) return null;

    if (w.windSpeed > 30) return "Hay bastante viento. ¡Cuidado con las ráfagas! 🌬️";
    if (w.temp < 10) return "Hace frío. ¡Acuérdate de abrigarte bien! 🧥";
    if (w.temp > 30) return "Hace calor. ¡Mantente hidratado y a la sombra! 💧";
    if (w.solarRad > 500 && w.windSpeed < 15 && w.temp >= 15 && w.temp <= 28) {
      return "Día espectacular. ¡Ideal para salir a pasear o tomar unos mates! ☀️🧉";
    }
    if (w.temp >= 10 && w.temp < 15) return "Está fresco. ¡Un abrigo ligero y a disfrutar! 🧣";
    
    return "Lindo día para disfrutar. ¡Que tengas un buen día! 😊";
  };

  const getBackgroundGradient = () => {
    if (!weather) return "from-indigo-600 via-purple-600 to-pink-500";
    if (weather.temp > 30) return "from-orange-500 via-red-500 to-rose-600";
    if (weather.temp < 10) return "from-blue-700 via-sky-600 to-teal-500";
    if (isNight()) return "from-slate-900 via-purple-900 to-indigo-900";
    return "from-indigo-500 via-purple-500 to-pink-500";
  };

  const getRelativeTime = (timestamp: number) => {
    try {
      const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
      const diff = now - timestamp;
      const diffMins = Math.round(diff / 60000);
      if (diffMins < 1) return 'Hace un momento';
      if (diffMins < 60) return rtf.format(-diffMins, 'minute');
      const diffHours = Math.round(diffMins / 60);
      if (diffHours < 24) return rtf.format(-diffHours, 'hour');
    } catch(e) {}
    return new Date(timestamp).toLocaleString('es-AR');
  };

  const handleShareWeather = async () => {
    setShowShareMenu(false);
    if (navigator.share && weather) {
      try {
        await navigator.share({
          title: 'Clima en Las Bardas',
          text: `Actual: ${weather.temp}°C, Viento: ${weather.windSpeed}km/h en B° Las Bardas, Choele Choel.`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  const handleShareApp = async () => {
    setShowShareMenu(false);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Estación Meteorológica Las Bardas',
          text: 'Mirá la Estación Meteorológica B° Las Bardas, Choele Choel.',
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} flex flex-col font-sans text-white p-6 md:p-12 overflow-x-hidden selection:bg-white/30 transition-colors duration-1000`}>
      <div className="max-w-[1200px] w-full mx-auto flex flex-col flex-1">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 lg:mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase flex items-center gap-3">
              <Activity className="w-10 h-10 text-indigo-200" />
              CLIMA DEL BARRIO LAS BARDAS
            </h1>
            <p className="text-indigo-100 font-medium opacity-80 uppercase tracking-widest text-sm mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Estación Meteorológica del Barrio Las Bardas de Choele Choel
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {installPrompt && (
              <button 
                onClick={handleInstallClick}
                className="bg-indigo-900/50 hover:bg-indigo-900/80 border border-white/20 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Download className="w-6 h-6" />
                <span className="hidden md:inline">INSTALAR APP</span>
                <span className="md:hidden">INSTALAR</span>
              </button>
            )}
            <button 
              onClick={fetchWeather}
              disabled={loading}
              className="bg-white text-indigo-600 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
            >
              <RefreshCcw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">ACTUALIZAR DATOS</span>
              <span className="md:hidden">ACTUALIZAR</span>
            </button>
            {'share' in navigator && (
              <div className="relative" ref={shareMenuRef}>
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="bg-indigo-900/50 hover:bg-indigo-900/80 border border-white/20 text-white px-6 py-3 md:px-6 md:py-4 rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                  title="Compartir"
                >
                  <Share2 className="w-6 h-6" />
                </button>
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white text-indigo-950 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
                    >
                      <button 
                        onClick={handleShareWeather}
                        className="px-4 py-3 text-left font-bold hover:bg-indigo-50 flex items-center gap-3 border-b border-indigo-100 transition-colors"
                      >
                        <Cloud className="w-5 h-5 text-indigo-500" />
                        Compartir Clima
                      </button>
                      <button 
                        onClick={handleShareApp}
                        className="px-4 py-3 text-left font-bold hover:bg-indigo-50 flex items-center gap-3 transition-colors"
                      >
                        <Share2 className="w-5 h-5 text-indigo-500" />
                        Compartir Aplicación
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-white p-4 rounded-2xl mb-8 flex items-center gap-3">
            <ArrowDownCircle className="w-6 h-6 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!weather && !error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center text-white/50"
            >
              <RefreshCcw className="w-12 h-12 animate-spin" />
            </motion.div>
          )}

          {weather && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex-1 flex flex-col"
            >
              {/* Tabs */}
              <div className="flex bg-black/20 backdrop-blur-md rounded-full p-1 w-fit mb-8 border border-white/10">
                <button
                  onClick={() => setActiveTab('current')}
                  className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'current' ? 'bg-white text-indigo-700 shadow-lg' : 'text-white/70 hover:text-white'}`}
                >
                  Clima Actual
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'stats' ? 'bg-white text-indigo-700 shadow-lg' : 'text-white/70 hover:text-white'}`}
                >
                  Resumen 24hs
                </button>
                <button
                  onClick={() => setActiveTab('forecast')}
                  className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'forecast' ? 'bg-white text-indigo-700 shadow-lg' : 'text-white/70 hover:text-white'}`}
                >
                  Pronóstico
                </button>
              </div>

              {activeTab === 'current' ? (
                <div className="flex-1 flex flex-col lg:flex-row gap-12 lg:items-center">
                  {/* Huge Temperature */}
                  <div className="flex-1 lg:max-w-xl">
                    <div className="flex items-start">
                      <span className="text-[120px] sm:text-[180px] lg:text-[220px] font-black leading-none drop-shadow-2xl tracking-tighter">
                        {weather.temp.toFixed(1)}
                      </span>
                      <span className="text-5xl sm:text-6xl lg:text-7xl font-bold mt-6 sm:mt-8 lg:mt-12">°C</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:-mt-4 mt-4">
                      <div className={`p-3 sm:p-4 rounded-2xl shadow-lg shrink-0 flex items-center justify-center ${isNight() ? 'bg-indigo-800 text-4xl sm:text-5xl' : 'bg-white/20'}`}>
                        {isNight() ? (
                          <span role="img" aria-label={getMoonPhaseInfo(new Date())} className="leading-none pb-1">
                            {getMoonPhaseEmoji(new Date())}
                          </span>
                        ) : (
                          <Thermometer className={`w-10 h-10 sm:w-12 sm:h-12 text-white`} />
                        )}
                      </div>
                      <div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold capitalize">
                          {isNight() ? getMoonPhaseInfo(new Date()) : "Actual"}
                        </h2>
                        <p className="text-lg sm:text-xl text-indigo-100 opacity-90">Sensación térmica de {weather.windChill}°C</p>
                      </div>
                    </div>

                    {getWeatherRecommendation(weather) && (
                      <div className="mt-6 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl inline-block max-w-full">
                        <p className="font-medium text-lg leading-snug">
                          {getWeatherRecommendation(weather)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Detail Cards Grid */}
                  <div className="grid grid-cols-2 gap-4 lg:gap-6 w-full lg:w-[450px]">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 lg:p-6 rounded-[28px] lg:rounded-[32px] flex flex-col justify-between">
                      <p className="uppercase text-xs font-black tracking-widest text-indigo-200">Humedad</p>
                      <p className="text-3xl lg:text-4xl font-bold mt-2">{weather.humidity}<span className="text-lg lg:text-xl opacity-60 ml-1">%</span></p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 lg:p-6 rounded-[28px] lg:rounded-[32px] flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <p className="uppercase text-xs font-black tracking-widest text-indigo-200">Viento <span className="opacity-70">({getWindDirectionStr(weather.windDirection)})</span></p>
                        <div 
                          className="bg-white/20 p-1.5 rounded-full flex items-center justify-center transition-transform duration-1000 shadow-sm"
                          style={{ transform: `rotate(${weather.windDirection}deg)` }}
                        >
                          <Navigation className="w-4 h-4 fill-white text-white drop-shadow-md" />
                        </div>
                      </div>
                      <div className="mt-2 flex flex-col gap-1">
                        <div className="flex justify-between items-end">
                          <span className="text-xs opacity-80">Actual</span>
                          <p className="text-xl font-bold leading-none">{weather.windSpeed}<span className="text-xs opacity-60 ml-1">km/h</span></p>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-xs opacity-80">Ráfaga</span>
                          <p className="text-xl font-bold leading-none text-yellow-300">{weather.windGust}<span className="text-xs opacity-60 ml-1">km/h</span></p>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-xs opacity-80">Media</span>
                          <p className="text-xl font-bold leading-none">{weather.windAvg}<span className="text-xs opacity-60 ml-1">km/h</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 lg:p-6 rounded-[28px] lg:rounded-[32px] flex flex-col justify-between">
                      <p className="uppercase text-xs font-black tracking-widest text-indigo-200">Presión</p>
                      <p className="text-3xl lg:text-4xl font-bold mt-2">{weather.pressure}<span className="text-lg lg:text-xl opacity-60 ml-1">hPa</span></p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 lg:p-6 rounded-[28px] lg:rounded-[32px] flex flex-col justify-between">
                      <p className="uppercase text-xs font-black tracking-widest text-indigo-200">Radiación Solar</p>
                      <p className="text-3xl lg:text-4xl font-bold mt-2">{weather.solarRad}<span className="text-lg lg:text-xl opacity-60 ml-1">W/m²</span></p>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'forecast' ? (
                <div className="flex-1 flex flex-col items-center">
                  <h2 className="text-2xl font-black tracking-tight mb-8 uppercase flex items-center gap-3 text-center">
                    <CalendarDays className="w-6 h-6 text-indigo-200" />
                    Pronóstico
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                    {forecast ? forecast.map((day, i) => {
                      const dayName = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : day.date;
                      
                      let Icon = Cloud;
                      const code = day.weatherCode;
                      
                      if (code === 0 || code === 1) Icon = Sun;
                      else if (code === 2 || code === 3) Icon = CloudSun;
                      else if (code >= 51 && code <= 67) Icon = CloudRain;
                      else if (code >= 71 && code <= 86) Icon = CloudSnow;
                      else if (code >= 95) Icon = CloudLightning;

                      return (
                        <div key={day.date} className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl flex flex-col items-center justify-between gap-4 text-center group relative cursor-pointer">
                          <p className="uppercase text-xs font-black tracking-widest text-indigo-200">{dayName}</p>
                          <Icon className="w-10 h-10 text-white" />
                          <div className="flex flex-col items-center w-full gap-1">
                            <div className="flex justify-between w-full text-sm">
                              <span className="opacity-80">Máx</span>
                              <span className="font-bold text-red-300">{Math.round(day.maxTemp)}°</span>
                            </div>
                            <div className="flex justify-between w-full text-sm">
                              <span className="opacity-80">Mín</span>
                              <span className="font-bold text-blue-300">{Math.round(day.minTemp)}°</span>
                            </div>
                          </div>
                          
                          <div className="absolute inset-0 bg-indigo-900/90 rounded-3xl p-3 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none backdrop-blur-sm border border-indigo-400/30">
                            {day.desc || "Sin descripción"}
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="col-span-full py-12 flex justify-center text-indigo-200 animate-pulse font-medium">
                        Cargando pronóstico...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center">
                  <h2 className="text-2xl font-black tracking-tight mb-8">RÉCORDS DE LAS ÚLTIMAS 24 HORAS</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[32px] flex flex-col">
                      <div className="flex items-center gap-3 text-indigo-200 mb-4">
                        <Thermometer className="w-5 h-5" />
                        <p className="uppercase text-sm font-black tracking-widest">Temperatura</p>
                      </div>
                      <div className="flex flex-col gap-2 mt-auto">
                        <div className="flex justify-between items-end">
                          <span className="text-sm opacity-80">Máxima</span>
                          <p className="text-2xl font-bold text-red-300">{weather.stats24h?.tempMax ?? '-'}<span className="text-sm opacity-60 ml-1">°C</span></p>
                        </div>
                        <div className="flex justify-between items-end border-t border-white/10 pt-2">
                          <span className="text-sm opacity-80">Mínima</span>
                          <p className="text-2xl font-bold text-blue-300">{weather.stats24h?.tempMin ?? '-'}<span className="text-sm opacity-60 ml-1">°C</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[32px] flex flex-col">
                      <div className="flex items-center gap-3 text-indigo-200 mb-4">
                        <Wind className="w-5 h-5" />
                        <p className="uppercase text-sm font-black tracking-widest">Viento (Máx)</p>
                      </div>
                      <div className="flex flex-col gap-2 mt-auto">
                        <div className="flex justify-between items-end">
                          <span className="text-sm opacity-80">Media</span>
                          <p className="text-2xl font-bold">{weather.stats24h?.wspdMax ?? '-'}<span className="text-sm opacity-60 ml-1">km/h</span></p>
                        </div>
                        <div className="flex justify-between items-end border-t border-white/10 pt-2">
                          <span className="text-sm opacity-80">Ráfaga</span>
                          <p className="text-2xl font-bold text-yellow-300">{weather.stats24h?.windGustMax ?? '-'}<span className="text-sm opacity-60 ml-1">km/h</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[32px] flex flex-col">
                      <div className="flex items-center gap-3 text-indigo-200 mb-4">
                        <Droplets className="w-5 h-5" />
                        <p className="uppercase text-sm font-black tracking-widest">Humedad</p>
                      </div>
                      <div className="flex flex-col gap-2 mt-auto">
                        <div className="flex justify-between items-end">
                          <span className="text-sm opacity-80">Máxima</span>
                          <p className="text-2xl font-bold text-emerald-300">{weather.stats24h?.humMax ?? '-'}<span className="text-sm opacity-60 ml-1">%</span></p>
                        </div>
                        <div className="flex justify-between items-end border-t border-white/10 pt-2">
                          <span className="text-sm opacity-80">Mínima</span>
                          <p className="text-2xl font-bold text-orange-200">{weather.stats24h?.humMin ?? '-'}<span className="text-sm opacity-60 ml-1">%</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[32px] flex flex-col">
                      <div className="flex items-center gap-3 text-indigo-200 mb-4">
                        <Activity className="w-5 h-5" />
                        <p className="uppercase text-sm font-black tracking-widest">Presión</p>
                      </div>
                      <div className="flex flex-col gap-2 mt-auto">
                        <div className="flex justify-between items-end">
                          <span className="text-sm opacity-80">Máxima</span>
                          <p className="text-2xl font-bold text-blue-200">{weather.stats24h?.pressureMax ?? '-'}<span className="text-sm opacity-60 ml-1">hPa</span></p>
                        </div>
                        <div className="flex justify-between items-end border-t border-white/10 pt-2">
                          <span className="text-sm opacity-80">Mínima</span>
                          <p className="text-2xl font-bold text-orange-200">{weather.stats24h?.pressureMin ?? '-'}<span className="text-sm opacity-60 ml-1">hPa</span></p>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="w-full mt-4">
                    <WeatherChart />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Bar */}
        {weather && (
          <footer className="mt-8 lg:mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-end border-t border-white/10 pt-6 lg:pt-8 gap-6">
            <div className="flex flex-wrap sm:flex-nowrap gap-6 sm:gap-12">
              {activeTab === 'current' && (
                <>
                  <div>
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-indigo-200 mb-1">Punto de Rocío</p>
                    <p className="text-lg sm:text-xl font-bold">{weather.dewPoint}°C</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-indigo-200 mb-1">Índice UV</p>
                    <p className="text-lg sm:text-xl font-bold">{weather.uvIndex}</p>
                  </div>
                </>
              )}
            </div>
            <div className="text-left sm:text-right opacity-60 mt-4 sm:mt-0 max-w-[200px] w-full shrink-0">
              <p className="text-[11px] sm:text-xs font-medium">Última actualización</p>
              <p className="font-mono text-xs sm:text-sm">{getRelativeTime(weather.timestamp)}</p>
            </div>
          </footer>
        )}

        {/* Developer Legend */}
        <div className="mt-8 text-center opacity-50 pb-4">
          <p className="text-xs font-medium tracking-wide">
            Desarrollado por Santiago Pueblas
          </p>
          <p 
            className="text-xs mt-1 font-medium tracking-wide cursor-pointer select-none"
            onClick={handleEasterEggClick}
          >
            Con el regalo del día del padre 💕
          </p>
        </div>
      </div>

      {showEasterEgg && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="bg-pink-500/90 text-white px-8 py-4 rounded-full font-black text-3xl shadow-2xl shadow-pink-500/50 backdrop-blur-md animate-bounce">
            María Te Amo ❤️
          </div>
        </div>
      )}
    </div>
  );
}

