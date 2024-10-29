import { Optional } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { CreateProductOrderDto } from "src/product-order/dto/create-product-order.dto";

export class CreateOrderDto {
    // @Optional()
    // @IsUUID()
    // @IsString()
    id: string;

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

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductOrderDto)
    products: CreateProductOrderDto[];

    @IsString()
    // @IsNotEmpty()
    @IsOptional()
    statusName: string;
}
