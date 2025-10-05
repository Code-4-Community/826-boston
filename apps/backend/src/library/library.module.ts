import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { Library } from './library.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Library])],
  controllers: [LibraryController],
  providers: [LibraryService, AuthService, JwtStrategy, CurrentUserInterceptor],
})
export class LibraryModule {}
