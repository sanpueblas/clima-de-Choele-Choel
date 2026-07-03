export interface WeatherData {
  last_update: number;
  [key: string]: number | [number, number];
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  desc: string;
}

export interface FormattedWeather {
  temp: number;
  humidity: number;
  dewPoint: number;
  windChill: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windAvg: number;
  windDirection: number;
  solarRad: number;
  uvIndex: number;
  timestamp: number;
  stats24h?: {
    tempMax: number;
    tempMin: number;
    humMax: number;
    humMin: number;
    pressureMax: number;
    pressureMin: number;
    wspdMax: number;
    windGustMax: number;
  };
}
