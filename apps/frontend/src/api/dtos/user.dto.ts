import Role from './role';

interface User {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  title?: string;

  role: Role;
}

export default User;
