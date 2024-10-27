import { Optional } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateProductOrderDto } from "src/product-order/dto/create-product-order.dto";

export class CreateOrderDto {
    // @Optional()
    // @IsUUID()
    // @IsString()
    id: string;

    @IsDateString()
    orderDate: Date;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductOrderDto)
    products: CreateProductOrderDto[];
}
