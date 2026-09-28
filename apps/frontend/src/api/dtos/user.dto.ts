import Role from './role';

interface User {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  title: string;

  pronouns?: string | null;

  role: Role;
}

export default User;
