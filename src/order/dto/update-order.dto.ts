import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsDateString()
  orderDate: Date; 

  @IsString()
  @IsNotEmpty()
  @MaxLength(255) 
  username: string;

  @IsEmail()
  @MaxLength(255) 
  email: string;

  @IsString()
  @MaxLength(50)
  phone: string;

  @IsString()
  @IsOptional()
  statusName: string;

} 
