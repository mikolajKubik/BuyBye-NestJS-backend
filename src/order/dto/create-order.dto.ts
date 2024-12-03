import { Type } from "class-transformer";
import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, Matches, MaxLength, Min, MinLength, ValidateNested } from "class-validator";
import { CreateProductOrderDto } from "src/product-order/dto/create-product-order.dto";

export class CreateOrderDto {

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

    @MinLength(1)
    @IsString()
    @MinLength(1)
    @MaxLength(9)
    @Matches(/^\d+$/, { message: 'Phone number can contain only numbers' })
    phone: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductOrderDto)
    products: CreateProductOrderDto[];

    @IsString()
    @IsOptional()
    statusName: string;
}
