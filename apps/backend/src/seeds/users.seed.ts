import { Role } from 'src/users/types';
import { User } from 'src/users/user.entity';
import { DeepPartial } from 'typeorm';

export const UsersSeed: DeepPartial<User>[] = [
  {
    id: 1,
    role: Role.ADMIN,
    firstName: 'Richie',
    lastName: 'Jacobs',
    email: 'richie.jacobs@gmail.com',
    title: 'Publishing Manager',
  },
  {
    id: 2,
    role: Role.ADMIN,
    firstName: 'Kanyin',
    lastName: 'Brown',
    email: 'kanyin.brown@gmail.com',
    title: 'Volunteer Manager',
  },
  {
    id: 3,
    role: Role.ADMIN,
    firstName: 'Mirn',
    lastName: 'Miller',
    email: 'mirn.miller@gmail.com',
    title: 'Program Manager',
  },
  {
    id: 4,
    role: Role.STANDARD,
    firstName: 'Kelly',
    lastName: 'Williams',
    email: 'kelly.williams@gmail.com',
    title: 'Community Partner',
  },
  {
    id: 5,
    role: Role.STANDARD,
    firstName: 'Tony',
    lastName: 'King',
    email: 'tony.king@gmail.com',
    title: 'Director of Communications',
  },
  {
    id: 6,
    role: Role.STANDARD,
    firstName: 'Sasha',
    lastName: 'Nguyen',
    email: 'sasha.nguyen@gmail.com',
    title: 'Program Assistant',
  },
  {
    id: 7,
    role: Role.STANDARD,
    firstName: 'Jamie',
    lastName: 'Rivera',
    email: 'jamie.rivera@gmail.com',
    title: 'Publishing Fellow',
  },
  {
    id: 8,
    role: Role.ADMIN,
    firstName: 'Gauri',
    lastName: 'Rajesh',
    email: 'gauri.ggsr@gmail.com',
    title: 'Volunteer Assistant',
  },
];
