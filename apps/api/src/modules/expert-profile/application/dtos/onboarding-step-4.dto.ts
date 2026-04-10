import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PayoutMethod,
  FRENCH_IBAN_REGEX,
  ACCOUNT_HOLDER_NAME_REGEX,
} from '@beep/shared';

class BankTransferDetailsDto {
  @IsString()
  @IsNotEmpty({ message: 'Account holder name is required' })
  @MinLength(3, { message: 'Account holder name must be at least 3 characters' })
  @MaxLength(100, { message: 'Account holder name must be at most 100 characters' })
  @Matches(ACCOUNT_HOLDER_NAME_REGEX, {
    message: 'Account holder name must contain only letters, spaces, hyphens, and apostrophes',
  })
  accountHolderName!: string;

  @IsString()
  @IsNotEmpty({ message: 'IBAN is required' })
  @Matches(FRENCH_IBAN_REGEX, {
    message: 'IBAN must be in French format: FR followed by 25 characters (27 total, e.g. FR7630006000011234567890189)',
  })
  iban!: string;
}

export class OnboardingStep4Dto {
  @IsEnum(PayoutMethod)
  payoutMethod!: PayoutMethod;

  @ValidateNested()
  @Type(() => BankTransferDetailsDto)
  @IsNotEmpty({ message: 'Bank transfer details are required' })
  bankTransferDetails!: BankTransferDetailsDto;
}
