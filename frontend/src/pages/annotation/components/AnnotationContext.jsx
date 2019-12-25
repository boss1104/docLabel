import React from 'react';

const AnnotatationContext = React.createContext({});

const AnnotatationProvider = props => {
  const { dispatch, annoList = [], isApprover, currentProject } = props.value;

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
  const isProjectAdmin = currentProject && currentProject.current_users_role.is_project_admin;

  const getContext = () => ({
    isDisabled,
    isProjectAdmin,
  });

  return (
    <AnnotatationContext.Provider value={{ ...props.value, ...getContext() }}>
      {props.children}
    </AnnotatationContext.Provider>
  );
};

export { AnnotatationContext, AnnotatationProvider };
