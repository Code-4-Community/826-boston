import {
  IsString,
  IsInt,
  IsBoolean,
  IsEnum,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubmissionRound, EditRound } from '../types';

export class CreateStoryDraftDto {
  @ApiProperty({ description: 'ID of the author' })
  @IsInt()
  authorId: number;

  @ApiProperty({ description: 'ID of the anthology' })
  @IsInt()
  anthologyId: number;

  @ApiProperty({ description: 'Link to the document' })
  @IsString()
  docLink: string;

  @ApiPropertyOptional({
    description: 'Submission round',
    enum: SubmissionRound,
    example: SubmissionRound.ONE,
  })
  @IsEnum(SubmissionRound)
  @IsOptional()
  submissionRound?: SubmissionRound;

  @ApiPropertyOptional({ description: 'Whether the student has given consent' })
  @IsBoolean()
  @IsOptional()
  studentConsent?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the story is in the manuscript',
  })
  @IsBoolean()
  @IsOptional()
  inManuscript?: boolean;

  @ApiPropertyOptional({
    description: 'Edit round',
    enum: EditRound,
    example: EditRound.ONE,
  })
  @IsEnum(EditRound)
  @IsOptional()
  editRound?: EditRound;

  @ApiPropertyOptional({ description: 'Whether the story has been proofread' })
  @IsBoolean()
  @IsOptional()
  proofread?: boolean;

  @ApiPropertyOptional({
    description: 'Notes about the story draft',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  notes?: string[];
}
