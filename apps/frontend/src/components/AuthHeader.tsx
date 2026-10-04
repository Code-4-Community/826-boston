import React from 'react';
import logo from '../assets/icons/826-boston-logo.png';

interface AuthHeaderProps {
  title: string;
  greeting?: string;
}

// Contains the logo and header text
const AuthHeader: React.FC<AuthHeaderProps> = ({ title, greeting }) => (
  <>
    <img className="auth-header__logo" src={logo} alt="826 Boston" />
    {greeting && <p className="auth-header__greeting">{greeting}</p>}
    <h1 className="auth-header__title">{title}</h1>
  </>
);

export default AuthHeader;
