import React from 'react';

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthField: React.FC<AuthFieldProps> = ({
  label,
  error,
  children,
  ...inputProps
}) => {
  return (
    <div className="auth-field">
      <label className="field-label">
        {label}
        <input
          placeholder={label}
          className={error ? 'field-input field-input--error' : 'field-input'}
          {...inputProps}
        />
      </label>
      {(error || children) && (
        <div className="field-footer">
          {error && <p className="field-error">{error}</p>}
          {children}
        </div>
      )}
    </div>
  );
};

export default AuthField;
