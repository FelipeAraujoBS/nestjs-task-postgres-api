import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  password?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;
}
