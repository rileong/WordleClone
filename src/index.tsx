import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import WORDS from './lib/words'
// import reportWebVitals from './reportWebVitals';

function isDST(d: Date) {
  let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
  let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) !== d.getTimezoneOffset();    
}

function getWordOfDay() {
  // March 5, 2022 Game Epoch
  const epochMs = new Date(2022, 2, 7).valueOf()
  let now = Date.now()
  const msInDay = 86400000
  if (isDST(new Date(now))) {
    now += msInDay / 24
  }
  const index = Math.floor((now - epochMs) / msInDay)
  // const nextday = (index + 1) * msInDay + epochMs
  // console.log(new Date().getTimezoneOffset())
  
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
