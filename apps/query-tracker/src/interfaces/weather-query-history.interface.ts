export interface WeatherQueryHistory {
  id: number;
  userId: number;
  location: string;
  temp: number;
  conditions: string[];
  cached: boolean;
  createdAt: Date | string;
}

export interface UserWeatherQueryHistory {
  userId: number;
  history: WeatherQueryHistory[];
}
