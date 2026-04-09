import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PayoutMethod,
  TUNISIAN_BANKS,
  MOBILE_PROVIDERS,
  TUNISIAN_IBAN_REGEX,
  TUNISIAN_PHONE_REGEX,
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
  @IsNotEmpty({ message: 'Bank name is required' })
  @IsIn([...TUNISIAN_BANKS], { message: 'Please select a valid Tunisian bank' })
  bankName!: string;

  @IsString()
  @IsNotEmpty({ message: 'IBAN or RIB is required' })
  @Matches(TUNISIAN_IBAN_REGEX, {
    message: 'IBAN must be in Tunisian format: TN59 followed by 20 digits (e.g. TN5900000000000000000000)',
  })
  iban!: string;
}

class MobileMoneyDetailsDto {
  @IsString()
  @IsNotEmpty({ message: 'Mobile provider is required' })
  @IsIn([...MOBILE_PROVIDERS], { message: 'Please select a valid mobile provider' })
  mobileProvider!: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(TUNISIAN_PHONE_REGEX, {
    message: 'Phone number must be a valid Tunisian number: +216 followed by 8 digits (e.g. +21612345678)',
  })
  mobilePhone!: string;
}

export class OnboardingStep4Dto {
  @IsEnum(PayoutMethod)
  payoutMethod!: PayoutMethod;

  @ValidateIf((o: OnboardingStep4Dto) => o.payoutMethod === PayoutMethod.BANK_TRANSFER)
  @ValidateNested()
  @Type(() => BankTransferDetailsDto)
  @IsNotEmpty({ message: 'Bank transfer details are required' })
  bankTransferDetails?: BankTransferDetailsDto;

  @ValidateIf((o: OnboardingStep4Dto) => o.payoutMethod === PayoutMethod.MOBILE_MONEY)
  @ValidateNested()
  @Type(() => MobileMoneyDetailsDto)
  @IsNotEmpty({ message: 'Mobile money details are required' })
  mobileMoneyDetails?: MobileMoneyDetailsDto;
}
