import { IsNotEmpty, IsString } from 'class-validator';

export class GetWeatherByCityDto {
  @IsString()
  @IsNotEmpty()
  city: string;
}
