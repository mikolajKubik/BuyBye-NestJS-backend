import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto {

    @IsNotEmpty() // Custom message to ensure we catch empty fields
    @IsString()
    @MaxLength(255)
    @MinLength(1)
    name: string;

    @IsNotEmpty() // Custom message to ensure we catch empty fields
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    description: string;

    @IsNotEmpty() // Custom message to ensure we catch empty fields
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Max(99999999.99)
    weight: number;

    @IsNotEmpty() // Custom message to ensure we catch empty fields
    @IsNumber()
    @Min(1)
    @Max(99999999)
    stock: number;

    @IsNotEmpty() // Custom message to ensure we catch empty fields
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Max(99999999.99)
    price: number;

    @IsNotEmpty() // Custom message to ensure we catch empty fields
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    categoryName: string;
}
