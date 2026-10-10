import { useCallback, useRef, useState } from 'react';

// Live form-validation helper.
//
//   const { values, handleChange, handleBlur, errorFor, markAllTouched, hasErrors } =
//     useForm(initialValues, validate);
//
// `validate(values)` must return an object mapping field name -> error message
// for every field that is currently invalid (empty object = all valid).
//
// Errors appear live as the user types (or after a field is blurred for empty
// required fields), so mistakes are caught before pressing submit.
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

  // Show an error as soon as the field is touched OR has content, so the form
  // never scolds the user for a field they haven't reached yet.
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
