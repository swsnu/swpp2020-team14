import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { createBrowserHistory } from 'history';
import { mount } from 'enzyme';
import App from './App';

import loginReducer from './sign/reducers/reducers';

export const history = createBrowserHistory();

describe('App', () => {
  const reducer = combineReducers({
    login: loginReducer,
  });
  const mockStore = createStore(reducer);
  let app;

  beforeEach(() => {
    history.location.pathname = '/';

    app = (
      <Provider store={mockStore}>
        <App history={history} />
      </Provider>
    );
  });

  it('should render without errors', () => {
    const component = mount(app);
    expect(component.find('.App').length).toBe(1);
  });
});
