import { IsIn, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateStatusDto {

    id: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @IsIn(['UNCONFIRMED', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
    name: string;
}
