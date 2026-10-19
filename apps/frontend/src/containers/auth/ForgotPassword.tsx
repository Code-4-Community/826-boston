import AuthField from '@components/AuthField';
import AuthHeader from '@components/AuthHeader';
import { resetPassword } from 'aws-amplify/auth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import OTPInput from 'react-otp-input';

// TODO: after the user inputs a code, nothing happens because there are no Figma designs for the steps after

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>();
  const [codeSent, setCodeSent] = useState(false);
  const [otp, setOtp] = useState('');

  const sendCode = async () => {
    setError(undefined);
    try {
      await resetPassword({ username: email });
      setCodeSent(true);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'LimitExceededException') {
        setError('Too many attempts. Please try again later.');
      } else {
        console.error(error);
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // checks if the field is empty or the wrong type
    if (!e.currentTarget.checkValidity()) {
      setError('Invalid Email.');
      return;
    }
    await sendCode();
  };

  return (
    <div className="auth-container">
      <form
        className="auth-card auth-card--forgot"
        noValidate
        onSubmit={handleSendCode}
      >
        <AuthHeader title="Retrieve your password"></AuthHeader>
        {codeSent ? (
          // entering the code
          <div className="otp">
            <p className="otp-field__label">Enter your one-time code</p>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputType="tel"
              skipDefaultStyles
              containerStyle="otp-container"
              inputStyle="otp-input"
              renderInput={(props) => <input {...props} />}
            />
            <div className="otp-footer">
              {error && <p className="field-error">{error}</p>}
              <button type="button" className="resend-code" onClick={sendCode}>
                Resend code
              </button>
            </div>
          </div>
        ) : (
          // entering the email to send the code to
          <>
            <AuthField
              label="Email"
              name="email"
              error={error}
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></AuthField>
            <button className="submit-button" type="submit">
              Send me a code
            </button>
          </>
        )}
      </form>
      <p className="auth-footer">
        Remember your password? <Link to="/login">Log in here.</Link>
      </p>
      <p className="auth-footer">
        Don’t have an account? <Link to="/register">Register here.</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
