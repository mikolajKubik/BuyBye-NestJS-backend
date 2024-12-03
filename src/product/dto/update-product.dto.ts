import { IsOptional, IsDecimal, IsNotEmpty, IsNumber, IsString, IsUUID, Max, max, MaxLength, Min, MinLength } from "class-validator";


export class UpdateProductDto {
    
    @IsOptional()
    @IsString()
    @MaxLength(255)
    @MinLength(1)
    name: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    description: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }) // , { message: 'Price can have up to 2 decimal places' }
    @Min(0.01) // , { message: 'Price must be a positive number' }
    @Max(99999999.99)
    weight: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(99999999)
    stock: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }) // , { message: 'Price can have up to 2 decimal places' }
    @Min(0.01) // , { message: 'Price must be a positive number' }
    @Max(99999999.99)  //, { message: 'Price cannot exceed 99999999.99' }
    price: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    categoryName: string;
}
