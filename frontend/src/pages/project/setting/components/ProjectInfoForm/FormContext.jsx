import React from 'react';
// Context
export const FormContext = React.createContext({});

// Hook
export const useFormContext = () => {
  const context = React.useContext(FormContext);
  if (!context.form) {
    throw new Error('Missing FormContextProvider in it parent.');
  }
  return context;
};
