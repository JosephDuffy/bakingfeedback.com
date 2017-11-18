import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore } from 'redux-persist';
import reduxThunk from 'redux-thunk';

import rootReducer, { AppState } from '../reducers';

export function configureStore(initialState?: AppState): { persistor: any, store: Store<AppState> } {
  const middleware = [reduxThunk];

  const store = createStore(rootReducer, initialState, composeWithDevTools(
    applyMiddleware(...middleware),
  )) as Store<AppState>;

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  const persistor = persistStore(store);

  return { persistor, store };
}
