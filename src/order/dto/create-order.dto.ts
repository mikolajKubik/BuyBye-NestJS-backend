import { Optional } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, Matches, MaxLength, Min, MinLength, ValidateNested } from "class-validator";
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
    @MinLength(1)
    username: string;

    @IsEmail()
    @MaxLength(255) 
    @MinLength(1)
    email: string;

    @MaxLength(50) 
    @MinLength(1)
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    @Matches(/^\d+$/, { message: 'Phone number can contain only numbers' })
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
