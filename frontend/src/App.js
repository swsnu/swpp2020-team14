import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { FontListView, FontItemView } from './font/views/all.js';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="navbar">
        </div>

        <Switch>
          <Route exact path="/font" component={FontListView} />
          <Route exact path="/font/:font_id" component={FontItemView} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
