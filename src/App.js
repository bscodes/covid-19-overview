import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar/Navbar';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home';

function App() {
  
  return (
    <> 
      <Navbar/>
      <ScrollToTop/>
      <Router>
        <Switch>
          <Route exact path = {'/'} component={Home} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
