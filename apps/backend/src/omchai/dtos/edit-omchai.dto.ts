import { PartialType, PickType } from '@nestjs/swagger';
import { CreateOmchaiDto } from './create-omchai.dto';

// Moving an assignment to another person or publication is a remove + add
export class EditOmchaiDto extends PartialType(
  PickType(CreateOmchaiDto, ['role', 'datetimeAssigned'] as const),
) {}
