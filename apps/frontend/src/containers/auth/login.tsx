import React from 'react';
import {
  Authenticator,
  Button,
  ThemeProvider,
  View,
  Flex,
  Image,
  Heading,
  Text,
  useAuthenticator,
} from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import './auth.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/826-boston-logo.png';

const components = {
  Header() {
    return (
      <Flex justifyContent="center">
        <Image alt="826 Boston Logo" src={logo} height="94px" />
      </Flex>
    );
  },
  SignUp: {
    Header() {
      return (
        <>
          <Text className="auth-greeting">Welcome to 826 Boston!</Text>
          <Heading className="auth-heading">Create your account</Heading>
        </>
      );
    },
  },
  ForgotPassword: {
    Header() {
      return <Heading className="auth-heading">Retrieve your password</Heading>;
    },
  },
  SignIn: {
    Header() {
      return (
        <>
          <Text className="auth-greeting">Welcome Back</Text>
          <Heading className="auth-heading">Log In</Heading>
        </>
      );
    },
    Footer() {
      const { toForgotPassword } = useAuthenticator((context) => [
        context.toForgotPassword,
      ]);

      return (
        <View className="auth-forgot-password">
          <Button variation="link" onClick={toForgotPassword}>
            Forgot Password?
          </Button>
        </View>
      );
    },
  },
};

const formFields = {
  signIn: {
    username: {
      label: 'Email',
      placeholder: 'Email',
    },
    password: {
      label: 'Password',
      placeholder: 'Password',
    },
  },
  signUp: {
    given_name: {
      label: 'First Name',
      placeholder: 'First Name',
      order: 1,
    },
    family_name: {
      label: 'Last Name',
      placeholder: 'Last Name',
      order: 2,
    },
    email: {
      label: 'Email',
      placeholder: 'Email',
      order: 3,
    },
    password: {
      label: 'Password',
      placeholder: 'Password',
      order: 4,
    },
    confirm_password: {
      label: 'Confirm Password',
      placeholder: 'Confirm Password',
      order: 5,
    },
  },
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { route, toSignUp } = useAuthenticator((context) => [
    context.route,
    context.toSignIn,
    context.toSignUp,
  ]);
  const isSignUp = route === 'signUp';

  return (
    <div className="auth-container">
      <ThemeProvider>
        <Authenticator
          initialState="signIn"
          components={components}
          formFields={formFields}
          loginMechanisms={['email']}
        >
          {({ user }) => {
            if (user) {
              if (
                import.meta.env.DEV &&
                !sessionStorage.getItem('dev-auth-token-logged')
              ) {
                sessionStorage.setItem('dev-auth-token-logged', '1');
                fetchAuthSession()
                  .then((session) => {
                    const idToken = session.tokens?.idToken?.toString();
                    console.log(
                      '[DEV] Use this bearer token for backend testing:',
                      {
                        bearerToken: idToken ? `Bearer ${idToken}` : null,
                        idToken,
                      },
                    );
                  })
                  .catch((error) => {
                    console.error(
                      '[DEV] Failed to fetch auth session tokens',
                      error,
                    );
                  });
              }
              setTimeout(() => navigate('/'), 0);
              return <div>Loading...</div>;
            }
            return <></>;
          }}
        </Authenticator>
        <View className="auth-register-here">
          <Text>Don't have an account?</Text>
          <Button variation="link" onClick={toSignUp}>
            Register here.
          </Button>
        </View>
      </ThemeProvider>
    </div>
  );
};

export default Login;
