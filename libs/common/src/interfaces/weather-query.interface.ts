export interface WeatherQuery {
  id: number;
  userId: string;
  location: string;
  temp: number;
  conditions: string;
  cached: boolean;
  createdAt: Date;
}
