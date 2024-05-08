import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./style.css"
import stores  from './stores'
import { Provider } from 'react-redux'
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
if(process.env.NODE_ENV === 'production') disableReactDevTools()
ReactDOM.render(
  <React.StrictMode>
    <Provider store={stores}>
    <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

