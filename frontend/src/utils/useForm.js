import { useCallback, useRef, useState } from 'react';


export function useForm(initial, validate) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState(() => validate(initial));
  const [touched, setTouched] = useState({});

  const validateRef = useRef(validate);
  validateRef.current = validate;
  const valuesRef = useRef(initial);
  valuesRef.current = values;

  const setField = useCallback((name, value) => {
    const next = { ...valuesRef.current, [name]: value };
    setValues(next);
    setErrors(validateRef.current(next));
  }, []);

  const setValuesAndValidate = useCallback((next) => {
    setValues(next);
    setErrors(validateRef.current(next));
  }, []);

  const handleChange = useCallback((e) => setField(e.target.name, e.target.value), [setField]);

  const handleBlur = useCallback((e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  }, []);

  const markAllTouched = useCallback(() => {
    setTouched((t) => {
      const all = {};
      Object.keys(valuesRef.current).forEach((k) => {
        all[k] = true;
      });
      return all;
    });
  }, []);

  
  const errorFor = useCallback(
    (name) => {
      const value = valuesRef.current[name];
      const hasContent =
        value !== undefined && value !== null && String(value).trim().length > 0;
      if (touched[name] || hasContent) return errors[name] || '';
      return '';
    },
    [errors, touched]
  );

  return {
    values,
    setValues: setValuesAndValidate,
    errors,
    touched,
    setField,
    handleChange,
    handleBlur,
    markAllTouched,
    errorFor,
    hasErrors: Object.keys(errors).length > 0,
  };
}
