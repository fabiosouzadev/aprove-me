import { Module } from '@nestjs/common';
import { PayableModule } from './payable/payable.module';
import { PrismaService } from './prisma.service';
import { AssignorModule } from './assignor/assignor.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';

@Module({
  imports: [AuthModule, PayableModule, AssignorModule],
  controllers: [UsersController],
  providers: [PrismaService, UsersService],
})
export class AppModule {}
