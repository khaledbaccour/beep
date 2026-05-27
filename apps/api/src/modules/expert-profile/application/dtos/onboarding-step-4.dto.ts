import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PayoutMethod,
  INDIAN_IFSC_REGEX,
  INDIAN_ACCOUNT_REGEX,
  UPI_REGEX,
  ACCOUNT_HOLDER_NAME_REGEX,
} from '@beep/shared';

class IndiaBankTransferDetailsDto {
  @IsString()
  @IsNotEmpty({ message: 'Account holder name is required' })
  @MinLength(3, { message: 'Account holder name must be at least 3 characters' })
  @MaxLength(100, { message: 'Account holder name must be at most 100 characters' })
  @Matches(ACCOUNT_HOLDER_NAME_REGEX, {
    message: 'Account holder name must contain only letters, spaces, hyphens, and apostrophes',
  })
  accountHolderName!: string;

  @IsString()
  @IsNotEmpty({ message: 'IFSC code is required' })
  @Matches(INDIAN_IFSC_REGEX, {
    message: 'IFSC code must be 4 letters + 0 + 6 alphanumeric (11 chars, e.g. SBIN0001234)',
  })
  ifscCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Account number is required' })
  @Matches(INDIAN_ACCOUNT_REGEX, {
    message: 'Account number must be 9 to 18 digits',
  })
  accountNumber!: string;
}

class UpiDetailsDto {
  @IsString()
  @IsNotEmpty({ message: 'UPI ID is required' })
  @Matches(UPI_REGEX, {
    message: 'UPI ID must be in format handle@provider (e.g. priya@okaxis)',
  })
  upiId!: string;
}

export class OnboardingStep4Dto {
  @IsEnum(PayoutMethod)
  payoutMethod!: PayoutMethod;

  @ValidateNested()
  @Type(() => IndiaBankTransferDetailsDto)
  @IsOptional()
  bankTransferDetails?: IndiaBankTransferDetailsDto;

  @ValidateNested()
  @Type(() => UpiDetailsDto)
  @IsOptional()
  upiDetails?: UpiDetailsDto;
}
