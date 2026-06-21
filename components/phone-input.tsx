import React, { useState, useEffect } from 'react';

const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'IN' },
  { code: '+92', country: 'PK' },
  { code: '+61', country: 'AU' },
  { code: '+49', country: 'DE' },
  { code: '+33', country: 'FR' },
  { code: '+81', country: 'JP' },
  { code: '+86', country: 'CN' },
  { code: '+55', country: 'BR' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function PhoneInput({ value, onChange, required = false }: PhoneInputProps) {
  // Parse initial value if it starts with a known country code
  const getInitialState = () => {
    for (const c of COUNTRY_CODES) {
      if (value.startsWith(c.code)) {
        return {
          code: c.code,
          number: value.slice(c.code.length).trim(),
        };
      }
    }
    return { code: '+1', number: value };
  };

  const [state, setState] = useState(getInitialState());

  useEffect(() => {
    const combined = `${state.code} ${state.number}`;
    if (combined !== value) {
      onChange(combined);
    }
  }, [state.code, state.number]);

  return (
    <div className="flex gap-2">
      <select
        value={state.code}
        onChange={(e) => setState({ ...state, code: e.target.value })}
        className="w-1/3 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} ({c.country})
          </option>
        ))}
      </select>
      <input
        type="tel"
        value={state.number}
        onChange={(e) => setState({ ...state, number: e.target.value })}
        placeholder="Phone number"
        className="w-2/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        required={required}
        pattern="[0-9\s-]{7,15}"
        title="Phone number must be between 7 to 15 digits."
      />
    </div>
  );
}
