export interface WeatherQuery {
  id: number;
  userId: number;
  location: string;
  temp: number;
  conditions: string[];
  cached: boolean;
  createdAt: Date;
}
