import {IsString, MinLength, IsPositive, IsNumber, IsOptional, IsInt, IsArray, IsIn} from 'class-validator'

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?:string

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    
    @IsArray()
    sizes: string[]

    @IsIn(['men', 'women', 'kids'])
    gender: string;
}
