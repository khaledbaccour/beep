import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { FRENCH_PHONE_REGEX } from '@beep/shared';

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
  @Matches(FRENCH_PHONE_REGEX, {
    message: 'Phone must be a valid French number (+33 followed by 9 digits)',
  })
  phone!: string;
}
