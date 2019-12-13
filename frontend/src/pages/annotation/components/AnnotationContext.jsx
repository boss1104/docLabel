import React from 'react';

const AnnotatationContext = React.createContext({});

const AnnotatationProvider = props => {
  const { dispatch } = props;
  const { annoList = [], isApprover } = props.value;

  React.useEffect(() => {
    const queryLabel = async () => {
      await dispatch({
        type: 'label/fetch',
      });
    };
    queryLabel();
    return () => {
      dispatch({
        type: 'label/reset',
      });
    };
  }, []);

  const isDisabled = (annoList[0] && annoList[0].finished) || isApprover;

  const getContext = () => ({
    isDisabled,
  });

  return (
    <AnnotatationContext.Provider value={{ ...props.value, ...getContext() }}>
      {props.children}
    </AnnotatationContext.Provider>
  );
};

export { AnnotatationContext, AnnotatationProvider };
