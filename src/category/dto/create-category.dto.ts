import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {

    id: string;

    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    name: string;
}
