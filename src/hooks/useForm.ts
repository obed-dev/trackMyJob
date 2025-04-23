import { useEffect, useMemo, useState, ChangeEvent } from 'react';

type ValidationFunction<T> = (value: T) => boolean;
type FormValidations<T> = {
  [K in keyof T]?: [ValidationFunction<T[K]>, string];
};

type FormValidationState<T> = {
  [K in keyof T as `${string & K}Valid`]?: string | null;
};

export const useForm = <T extends Record<string, any>>(
  initialForm: T,
  formValidations: FormValidations<T> = {}
) => {
  const [formState, setFormState] = useState<T>(initialForm);
  const [formValidation, setFormValidation] = useState<FormValidationState<T>>({});

  useEffect(() => {
    createValidators();
  }, [formState]);

  useEffect(() => {
    setFormState(initialForm);
  }, [initialForm]);

  const isFormValid = useMemo(() => {
    return Object.values(formValidation).every((value) => value === null);
  }, [formValidation]);

  const onInputChange = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  const createValidators = () => {
    const formCheckedValues: FormValidationState<T> = {};

    for (const fieldName in formValidations) {
      const [fn, errorMessage] = formValidations[fieldName]!;
      const fieldValue = formState[fieldName];

      formCheckedValues[`${fieldName}Valid` as keyof FormValidationState<T>] = (
        fn(fieldValue) ? null : errorMessage
      ) as any;
    }

    setFormValidation(formCheckedValues);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    ...formValidation,
    isFormValid,
  };
};
