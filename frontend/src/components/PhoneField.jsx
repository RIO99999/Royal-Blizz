import { useEffect, useState } from 'react';

// Common international dial codes (Nigeria first, as this is a Nigerian marketplace).
const COUNTRY_CODES = [
  { code: '+234', label: 'Nigeria' },
  { code: '+1', label: 'USA / Canada' },
  { code: '+44', label: 'UK' },
  { code: '+233', label: 'Ghana' },
  { code: '+254', label: 'Kenya' },
  { code: '+27', label: 'South Africa' },
  { code: '+971', label: 'UAE' },
  { code: '+91', label: 'India' },
  { code: '+49', label: 'Germany' },
  { code: '+33', label: 'France' },
];

const splitPhone = (value) => {
  const v = String(value || '').trim();
  if (v.startsWith('+')) {
    const match = COUNTRY_CODES.map((c) => c.code)
      .filter((code) => v.startsWith(code))
      .sort((a, b) => b.length - a.length)[0];
    if (match) return { code: match, number: v.slice(match.length) };
    return { code: '+234', number: v.replace(/^\+\d+/, (m) => '') };
  }
  return { code: '+234', number: v };
};

// A phone input that always produces an international number ("+<country><digits>").
export default function PhoneField({ label = 'Phone', value = '', onChange, required = false }) {
  const [state, setState] = useState(() => splitPhone(value));

  useEffect(() => {
    setState(splitPhone(value));
  }, [value]);

  const emit = (code, number) => {
    if (onChange) onChange(`${code}${number}`);
  };

  const handleCode = (e) => {
    const code = e.target.value;
    setState((s) => ({ ...s, code }));
    emit(code, state.number);
  };

  const handleNumber = (e) => {
    const number = e.target.value.replace(/[^0-9]/g, '');
    setState((s) => ({ ...s, number }));
    emit(state.code, number);
  };

  return (
    <label className="field">
      <span>{label}</span>
      <div className="phone-field">
        <select className="input phone-code" value={state.code} onChange={handleCode} aria-label="Country code">
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} {c.label}
            </option>
          ))}
        </select>
        <input
          type="tel"
          className="input"
          placeholder="8012345678"
          value={state.number}
          onChange={handleNumber}
          required={required}
        />
      </div>
    </label>
  );
}
