import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';

import { updateProfileStoreSaga, updateSettingsStoreSaga } from '../sagas';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(history, initialState) {
  const middlewares = [
    thunk,
    promiseMiddleware(),
    sagaMiddleware,
    routerMiddleware(history),
  ];

  const enhancer = applyMiddleware(...middlewares);

  const store = createStore(rootReducer, initialState, enhancer);
  sagaMiddleware.run(updateProfileStoreSaga);
  sagaMiddleware.run(updateSettingsStoreSaga);

  return store;
}
