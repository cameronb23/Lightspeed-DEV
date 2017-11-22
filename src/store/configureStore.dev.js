import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';

import { updateProfileStoreSaga, updateSettingsStoreSaga } from '../sagas';

import DevTools from '../containers/DevTools';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(history, initialState) {
  const middlewares = [
    thunk,
    promiseMiddleware(),
    sagaMiddleware,
    routerMiddleware(history),
  ];

  const enhancer = compose(
    applyMiddleware(...middlewares),
    DevTools.instrument(),
  );

  const store = createStore(rootReducer, initialState, enhancer);

  sagaMiddleware.run(updateProfileStoreSaga);
  sagaMiddleware.run(updateSettingsStoreSaga);


  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default), // eslint-disable-line global-require
    );
  }

  return store;
}
