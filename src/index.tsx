// import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// @ts-ignore
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import reportWebVitals from './reportWebVitals';
import { GlobalModelsProvider } from './contexts/ModelsContext';
import { UserProvider } from './contexts/UserContext';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

ReactDOM.render(
  // <React.StrictMode>
  <GlobalModelsProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </GlobalModelsProvider>
  // {/* </React.StrictMode> */}
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
