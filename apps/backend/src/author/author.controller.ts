import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { EditAuthorDto } from './dtos/edit-author.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OmchaiGuard } from 'src/auth/guards/omchai.guard';
import { UserStatusGuard } from 'src/auth/guards/user-status.guard';
import { UserStatus, OmchaiRoles } from 'src/auth/roles.decorator';
import { OmchaiRole } from 'src/omchai/omchai.entity';
import { Role } from 'src/users/types';

@ApiTags('Author')
@ApiBearerAuth()
@Controller('author')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  /**
   * Create author with bio, name, and grade.
   * @param createAuthorDto frontend author data
   * @returns author with given bio, name, and grade.
   */

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard, OmchaiGuard)
  @UserStatus(Role.ADMIN, Role.STANDARD)
  @OmchaiRoles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
  @Post('/author')
  async createAuthor(
    @Body() createAuthorDto: CreateAuthorDto,
  ): Promise<Author> {
    return this.authorService.create(createAuthorDto);
  }

  /**
   * Update author with given id.
   * @param authorId author id
   * @param editAuthorDto bio, name, and/or grade of author that is being updated
   * @returns author with given id and updated fields
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard, OmchaiGuard)
  @UserStatus(Role.ADMIN, Role.STANDARD)
  @OmchaiRoles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
  @Put('/author/:authorId')
  async updateAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
    @Body() editAuthorDto: EditAuthorDto,
  ): Promise<Author> {
    return this.authorService.update(authorId, editAuthorDto);
  }

  /**
   * Get author with given id.
   * @param authorId id of author
   * @returns author with given id
   */
  @Get('/author/:authorId')
  async getAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
  ): Promise<Author> {
    return this.authorService.findOne(authorId);
  }

  /**
   * Get all authors.
   * @returns all authors in repository
   */

  @Get('/author')
  async getAuthors(): Promise<Author[]> {
    return this.authorService.findAll();
  }

  /**
   * Remove author with given id.
   * @param authorId id of author to remove
   * @returns removed author
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard, OmchaiGuard)
  @UserStatus(Role.ADMIN, Role.STANDARD)
  @OmchaiRoles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
  @Delete('/:authorId')
  async removeAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
  ): Promise<Author> {
    return this.authorService.remove(authorId);
  }
}
