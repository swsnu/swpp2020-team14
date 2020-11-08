import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { FontListView, FontItemView } from './font/views/all.js';

import { PhotoListView, PhotoItemView } from './photo/views/all.js';

import { ReportView } from './finding/views/report.js';

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
          <Route exact path="/my-page/photo" component={PhotoListView} />
          <Route exact path="/my-page/photo/:photo_id" component={PhotoItemView} />
          <Route exact path="/my-page/photo/:photo_id/report" component={ReportView} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
