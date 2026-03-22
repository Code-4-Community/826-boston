import { SetMetadata } from '@nestjs/common';
import { OmchaiRole } from 'src/omchai/omchai.entity';

// Key used to store roles metadata
export const ROLES_KEY = 'roles';
// Custom decorator to set roles metadata on route handlers for proper parsing by RolesGuard
export const Roles = (...roles: OmchaiRole[]) => SetMetadata(ROLES_KEY, roles);
