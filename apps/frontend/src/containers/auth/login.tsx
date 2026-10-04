import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';
import AuthHeader from '@components/AuthHeader';
import { fetchAuthSession, signIn } from 'aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react';
import AuthField from '@components/AuthField';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  useEffect(() => {
    if (authStatus === 'authenticated') {
      // log the token for testing
      if (
        import.meta.env.DEV &&
        !sessionStorage.getItem('dev-auth-token-logged')
      ) {
        sessionStorage.setItem('dev-auth-token-logged', '1');
        fetchAuthSession()
          .then((session) => {
            const idToken = session.tokens?.idToken?.toString();
            console.log('[DEV] Use this bearer token for backend testing:', {
              bearerToken: idToken ? `Bearer ${idToken}` : null,
              idToken,
            });
          })
          .catch((error) => {
            console.error('[DEV] Failed to fetch auth session tokens', error);
          });
      }
      navigate('/');
    }
  }, [authStatus, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = (name: string) =>
      // checks if the field is empty or the wrong type
      (e.currentTarget.elements.namedItem(name) as HTMLInputElement).validity
        .valid;
    const fieldErrors = {
      email: isValid('email') ? undefined : 'Invalid Email.',
      password: isValid('password') ? undefined : 'Invalid Password.',
    };
    setErrors(fieldErrors);
    if (fieldErrors.email || fieldErrors.password) return;

    try {
      await signIn({ username: email, password });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'UserAlreadyAuthenticatedException') {
          navigate('/');
        } else if (
          error.name === 'UserNotFoundException' ||
          error.name === 'NotAuthorizedException'
        ) {
          // Cognito does not disclose whether a user exists or not to prevent users from figuring out which emails are registered
          const message = 'Incorrect email or password entered.';
          setErrors({ email: message, password: message });
        } else {
          console.error(error);
          const message = 'Something went wrong. Please try again.';
          setErrors({ email: message, password: message });
        }
      }
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" noValidate onSubmit={handleLogin}>
        <AuthHeader greeting="Welcome Back" title="Log In"></AuthHeader>
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
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <button className="sign-in" type="submit">
          Sign In
        </button>
      </form>
      <p className="auth-footer">
        Don’t have an account? <Link to="/register">Register here.</Link>
      </p>
    </div>
  );
};

export default Login;
