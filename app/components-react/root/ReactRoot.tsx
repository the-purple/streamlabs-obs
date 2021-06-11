import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

export function createRoot(ChildComponent: (props: any) => JSX.Element) {
  return function ReactRoot(childProps: Object) {
    return (
      <Provider store={store}>
        <ChildComponent {...childProps} />
      </Provider>
    );
  };
}
