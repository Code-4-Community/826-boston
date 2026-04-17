import { Role } from '../users/types';

interface UserSeedItem {
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
}

export const UsersSeed: UserSeedItem[] = [
  {
    role: Role.ADMIN,
    firstName: 'Richie',
    lastName: 'Jacobs',
    email: 'richie.jacobs@gmail.com',
    title: 'Publishing Manager',
  },
  {
    role: Role.ADMIN,
    firstName: 'Kanyin',
    lastName: 'Brown',
    email: 'kanyin.brown@gmail.com',
    title: 'Volunteer Manager',
  },
  {
    role: Role.ADMIN,
    firstName: 'Mirn',
    lastName: 'Miller',
    email: 'mirn.miller@gmail.com',
    title: 'Program Manager',
  },
  {
    role: Role.STANDARD,
    firstName: 'Kelly',
    lastName: 'Williams',
    email: 'kelly.williams@gmail.com',
    title: 'Community Partner',
  },
  {
    role: Role.STANDARD,
    firstName: 'Tony',
    lastName: 'King',
    email: 'tony.king@gmail.com',
    title: 'Director of Communications',
  },
  {
    role: Role.ADMIN,
    firstName: 'Jordan',
    lastName: 'Hayes',
    email: 'jordan.hayes@gmail.com',
    title: 'Director of Programs',
  },
  {
    role: Role.ADMIN,
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@gmail.com',
    title: 'Operations Manager',
  },
  {
    role: Role.STANDARD,
    firstName: 'Sam',
    lastName: 'Chen',
    email: 'sam.chen@gmail.com',
    title: 'Event Coordinator',
  },
  {
    role: Role.STANDARD,
    firstName: 'Maya',
    lastName: 'Osei',
    email: 'maya.osei@gmail.com',
    title: 'School Partner',
  },
  {
    role: Role.STANDARD,
    firstName: 'Chris',
    lastName: 'Park',
    email: 'chris.park@gmail.com',
    title: 'Development Manager',
  },
];
