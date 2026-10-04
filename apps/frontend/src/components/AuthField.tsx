import React from 'react';

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthField: React.FC<AuthFieldProps> = ({
  label,
  error,
  ...inputProps
}) => {
  return (
    <div className="auth-field">
      <label className="field-label">
        {label}
        <input
          {...inputProps}
          placeholder={label}
          className={error ? 'field-input field-input--error' : 'field-input'}
        />
      </label>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
};

export default AuthField;
