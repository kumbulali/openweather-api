import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class IdDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  id: number;
}
