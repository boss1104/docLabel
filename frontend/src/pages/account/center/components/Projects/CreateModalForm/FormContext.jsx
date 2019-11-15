import React from 'react';
// Context
export const FormContext = React.createContext({});

// Hook
export const useFormContext = () => {
  const form = React.useContext(FormContext);
  if (!form) {
    throw new Error('Missing FormContextProvider in it parent.');
  }
  return form;
};
