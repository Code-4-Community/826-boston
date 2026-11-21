interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function Field({
  label,
  required = false,
  children,
}: FieldProps) {
  return (
    <div className="field">
      <label className="field__label">
        {label} {required && <span className="field__required">*</span>}
      </label>
      {children}
    </div>
  );
}
