import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter, { history } from './routers/AppRouter';
import configStore from './store/configStore';
import { login, logout } from './actions/auth.js';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import { firebase } from './firebase/firebase';
import LoadingPage from './components/LoadingPage';
// import './playground/promises';

const store = configStore();

// Provider lets us define the store to provide to our components
const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

let hasRendered = false;
const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById('app'));
    hasRendered = true;
  }
};

ReactDOM.render(<LoadingPage />, document.getElementById('app'));

// Login and Logout
firebase.auth().onAuthStateChanged((user) => {
  if (user) {   // Check if user is logged in
    store.dispatch(login(user.uid)); // Keep track of logged in user with Redux
    renderApp();
      if (history.location.pathname === '/') { // Only redirect logged in user to dashboard if on Login page
        history.push('/dashboard');
      };
  } else { // Log out
    store.dispatch(logout()); // Send LOGOUT action to Redux
    renderApp();
    history.push('/');
  }
});