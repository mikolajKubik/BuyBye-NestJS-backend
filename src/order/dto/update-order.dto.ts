import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsDateString()
  orderDate: Date; 

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255) 
  username: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255) 
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone: string;

  @IsString()
  @IsOptional()
  statusName: string;

} 
