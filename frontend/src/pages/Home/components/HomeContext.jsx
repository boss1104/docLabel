import React from 'react';

const HomeContext = React.createContext();

function HomeProvider(props) {
  const getContext = () => ({});
  return (
    <HomeContext.Provider value={{ ...props.value, ...getContext() }}>
      {props.children}
    </HomeContext.Provider>
  );
}

export { HomeProvider, HomeContext };
