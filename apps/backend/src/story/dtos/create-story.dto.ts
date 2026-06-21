import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoryDto {
  @ApiProperty({ description: 'Title of the story' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the story' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Student bio of story' })
  @IsString()
  @IsOptional()
  studentBio: string;

  @ApiProperty({ description: 'ID of Anthology the story is in' })
  @IsNumber()
  anthologyId: number;

  @ApiProperty({ description: 'Author of story' })
  @IsNumber()
  authorId: number;
}
