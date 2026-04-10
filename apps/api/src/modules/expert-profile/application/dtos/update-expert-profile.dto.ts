import { PartialType } from '@nestjs/swagger';
import { CreateExpertProfileDto } from './create-expert-profile.dto';

export class UpdateExpertProfileDto extends PartialType(CreateExpertProfileDto) {}
