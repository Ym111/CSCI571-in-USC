import React from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/pages/Home'
import CateNews from './components/pages/CateNews'
import SavedNews from './components/pages/SavedNews'
import NewsState from './contexts/NewsState'
import SearchNews from './components/pages/SearchNews';
import NewsCard from './components/pages/NewsCard';

const App = () => {
  //const customHistory = createBrowserHistory();

  return (
    <NewsState>
      <Router >
        <div className="App">
          <Navbar />
          <Switch>
            <Route
              exact
              path='/NewsDetail/:id'
              component={NewsCard} />
            <Route
              exact
              path='/Saved'
              component={SavedNews} />
            <Route
              exact
              path='/Search/:kw'
              component={SearchNews} />

            <Route
              exact
              path='/:cate'
              component={CateNews} />
            <Route component={Home} />
          </Switch>

        </div>
      </Router>
    </NewsState>
  );
}

export default App;

//TODO LIST
/*

17.  detail -> 4line limit  https://www.npmjs.com/package/react-truncate
4. search button




*/
