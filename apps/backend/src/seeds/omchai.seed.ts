import { Omchai, OmchaiRole } from 'src/omchai/omchai.entity';
import { DeepPartial } from 'typeorm';

export const OmchaiSeed: DeepPartial<Omchai>[] = [
  // Anthology 1
  {
    anthologyId: 1,
    userId: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 1,
    userId: 2,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 1,
    userId: 3,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 1,
    userId: 3,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 1,
    userId: 4,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 1,
    userId: 6,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date(),
  },

  // Anthology 5 — full set of roles with multi-user entries
  {
    anthologyId: 5,
    userId: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 3,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 6,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 4,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 5,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 7,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 6,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 2,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 5,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 1,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date(),
  },
];
