import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { TUNISIAN_PHONE_REGEX } from '@beep/shared';

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
  @Matches(TUNISIAN_PHONE_REGEX, {
    message: 'Phone must be a valid Tunisian number (+216 followed by 8 digits)',
  })
  phone!: string;
}
