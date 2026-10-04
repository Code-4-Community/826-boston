import AuthField from '@components/AuthField';
import AuthHeader from '@components/AuthHeader';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// TODO: backend currently doesn't support sign up, so this needs to be wired up

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = (name: string) =>
      // checks if the field is empty or the wrong type
      (e.currentTarget.elements.namedItem(name) as HTMLInputElement).validity
        .valid;
    const fieldErrors = {
      firstName: isValid('firstName') ? undefined : 'Invalid First Name.',
      lastName: isValid('lastName') ? undefined : 'Invalid Last Name.',
      email: isValid('email') ? undefined : 'Invalid Email.',
      password: isValid('password') ? undefined : 'Invalid Password.',
      confirmPassword:
        confirmPassword === password ? undefined : 'Password mismatch.',
    };
    setErrors(fieldErrors);
    if (Object.values(fieldErrors).some(Boolean)) return;
  };

  return (
    <div className="auth-container">
      <form className="auth-card" noValidate onSubmit={handleSignUp}>
        <AuthHeader
          greeting="Welcome to 826 Boston!"
          title="Create your account"
        ></AuthHeader>
        <AuthField
          label="First Name"
          name="firstName"
          error={errors.firstName}
          required
          type="name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        ></AuthField>
        <AuthField
          label="Last Name"
          name="lastName"
          error={errors.lastName}
          required
          type="name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        ></AuthField>
        <AuthField
          label="Email"
          name="email"
          error={errors.email}
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></AuthField>
        <AuthField
          label="Password"
          name="password"
          error={errors.password}
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></AuthField>
        <AuthField
          label="Confirm Password"
          name="confirmPassword"
          error={errors.confirmPassword}
          required
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></AuthField>
        <button className="submit-button" type="submit">
          Sign Up
        </button>
      </form>
      <p className="auth-footer">
        Have an account? <Link to="/login">Log in here.</Link>
      </p>
    </div>
  );
};

export default SignUp;
