import { Optional } from "@nestjs/common";
import { IsDecimal, IsNumber, IsString, IsUUID, Max, max, MaxLength, Min } from "class-validator";

export class CreateProductDto {
    // @Optional()
    // @IsUUID()
    // @IsString()
    // @Optional()
    id: string;

    @IsString()
    @MaxLength(255)
    name: string;

    @IsNumber()
    @Min(0)
    @Max(99999999)
    stock: number;

    @IsNumber({ maxDecimalPlaces: 2 }) // , { message: 'Price can have up to 2 decimal places' }
    @Min(0) // , { message: 'Price must be a positive number' }
    @Max(99999999.99)  //, { message: 'Price cannot exceed 99999999.99' }
    price: number;
}
