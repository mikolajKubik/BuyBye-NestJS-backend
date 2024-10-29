import { Optional } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsNumber, IsString, IsUUID, Max, max, MaxLength, Min, ValidateNested } from "class-validator";
import { CreateCategoryDto } from "src/category/dto/create-category.dto";
import { Category } from "src/category/entities/category.entity";

export class CreateProductDto {
    // @Optional()
    // @IsUUID()
    // @IsString()
    // @Optional()
    id: string;

    @IsString()
    @MaxLength(255)
    name: string;

    @IsString()
    @MaxLength(255)
    description: string;

    @IsNumber({ maxDecimalPlaces: 2 }) // , { message: 'Price can have up to 2 decimal places' }
    @Min(0) // , { message: 'Price must be a positive number' }
    @Max(99999999.99)
    weight: number;

    @IsNumber()
    @Min(1)
    @Max(99999999)
    stock: number;

    @IsNumber({ maxDecimalPlaces: 2 }) // , { message: 'Price can have up to 2 decimal places' }
    @Min(0) // , { message: 'Price must be a positive number' }
    @Max(99999999.99)  //, { message: 'Price cannot exceed 99999999.99' }
    price: number;

    @IsString()
    @IsNotEmpty()
    categoryName: string;
}
