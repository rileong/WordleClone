import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import WORDS from './lib/words'
// import reportWebVitals from './reportWebVitals';

function getWordOfDay() {
  // March 5, 2022 Game Epoch
  const epochMs = new Date(2022, 2, 4).valueOf()
  const now = Date.now()
  const msInDay = 86400000
  const index = Math.floor((now - epochMs) / msInDay)
  // const nextday = (index + 1) * msInDay + epochMs

  return index
}

ReactDOM.render(
  <React.StrictMode>
    {/* <App letterCount={6} /> */}
    <App word={WORDS[getWordOfDay()]} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
