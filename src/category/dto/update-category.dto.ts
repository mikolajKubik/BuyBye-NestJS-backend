import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateCategoryDto {
        
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    name: string;
}
