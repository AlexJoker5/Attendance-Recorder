import type { ReactNode } from 'react';
export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && (
        <p id={htmlFor + '-error'} className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
