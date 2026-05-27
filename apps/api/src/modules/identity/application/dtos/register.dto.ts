import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { INDIAN_PHONE_REGEX } from '@beep/shared';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(1)
  firstName!: string;

  @IsString()
  @MinLength(1)
  lastName!: string;

  @IsString()
  @Matches(INDIAN_PHONE_REGEX, {
    message: 'Phone must be a valid Indian mobile number (+91 followed by 10 digits starting with 6-9)',
  })
  phone!: string;
}
