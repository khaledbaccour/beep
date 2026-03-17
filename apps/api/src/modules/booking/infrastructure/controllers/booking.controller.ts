import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from '../../application/services/booking.service';
import { CreateBookingDto } from '../../application/dtos/create-booking.dto';
import { ConfirmPaymentDto } from '../../application/dtos/confirm-payment.dto';
import { CancelBookingDto } from '../../application/dtos/cancel-booking.dto';
import { BookingResponseDto } from '../../application/dtos/booking-response.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../identity/domain/interfaces/authenticated-user.interface';
import { UserRole } from '@beep/shared';
import { ApiResponseDto } from '../../../../common/application/dtos/api-response.dto';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBookingDto,
  ): Promise<ApiResponseDto<BookingResponseDto>> {
    const result = await this.bookingService.createBooking(user, dto);
    return ApiResponseDto.ok(result);
  }

  @Post(':id/confirm-payment')
  async confirmPayment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: ConfirmPaymentDto,
  ): Promise<ApiResponseDto<BookingResponseDto>> {
    const result = await this.bookingService.confirmPayment(user, id, dto);
    return ApiResponseDto.ok(result);
  }

  @Post(':id/cancel')
  async cancel(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CancelBookingDto,
  ): Promise<ApiResponseDto<BookingResponseDto>> {
    const result = await this.bookingService.cancelBooking(user, id, dto);
    return ApiResponseDto.ok(result);
  }

  @Get('my')
  async myBookings(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponseDto<BookingResponseDto[]>> {
    const result = await this.bookingService.getMyBookings(user);
    return ApiResponseDto.ok(result);
  }

  @Get('expert')
  @UseGuards(RolesGuard)
  @Roles(UserRole.EXPERT)
  async expertBookings(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponseDto<BookingResponseDto[]>> {
    const result = await this.bookingService.getExpertBookings(user);
    return ApiResponseDto.ok(result);
  }

  @Get(':id')
  async getOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<ApiResponseDto<BookingResponseDto>> {
    const result = await this.bookingService.getBooking(user, id);
    return ApiResponseDto.ok(result);
  }
}
