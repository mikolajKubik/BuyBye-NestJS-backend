import { Optional } from "@nestjs/common";
import { IsInt, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateProductOrderDto {
    // @IsUUID()
    // @Optional()
    // @IsString()
    id: string;

    @IsInt() // { message: 'Quantity must be an integer' }
    @Min(1) //, { message: 'Quantity must be at least 1' }
    @Max(99999999) //, { message: 'Quantity cannot exceed 99999999' }
    quantity: number;

    
}
