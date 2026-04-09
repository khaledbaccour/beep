import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../identity/domain/interfaces/authenticated-user.interface';
import { SessionService } from '../../application/services/session.service';
import { SessionAccessResponseDto } from '../../application/dtos/session-access.dto';

@Controller('session')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get(':roomId/access')
  async checkAccess(
    @CurrentUser() user: AuthenticatedUser,
    @Param('roomId') roomId: string,
  ): Promise<{ data: SessionAccessResponseDto }> {
    const result = await this.sessionService.checkAccess(roomId, user.id);
    return { data: result };
  }
}
