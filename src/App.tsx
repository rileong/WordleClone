// import React from 'react';
import React, { useEffect, useState } from 'react';
import './App.css';

interface propInterface {
  letterCount: number;
}

const CLASS_CODES = [
  "",
  "wrong",
  "rightLetter",
  "rightSpot"
]

function App(props: propInterface) {

  function handleKeyDown(char: string) {
    if (char === "Enter") char = '↵'
    if (char === "Backspace") char = '←'
    const checker = new RegExp('^[a-zA-Z←↵]{1}$')
    if (!checker.test(char)) { // not a valid key
      return
    }
  }

  const [guessCount, setGuessCount] = useState(0)
  const [colorMatrix, setColorMatrix] = useState([
    [],
    [],
    [],
    [],
    [],
    [],
  ])

  useEffect(() => {
    console.log(props);
    document.documentElement.style.setProperty('--letterCount', props.letterCount.toString())
    window.addEventListener('keydown', (e: KeyboardEvent) => {e.preventDefault();handleKeyDown(e.key)})
    let keys = Array.from(document.getElementsByTagName('button'))
    keys.forEach(el => {
      el.addEventListener('click', () => handleKeyDown(el.getAttribute('data-key') || ''))
    })

    return () => {
      window.removeEventListener('keydown', (e: KeyboardEvent) => {e.preventDefault();handleKeyDown(e.key)})
      Array.from(document.getElementsByTagName('button')).forEach(el => {
        el.removeEventListener('click', () => handleKeyDown(el.getAttribute('data-key') || ''))
      })
    }
  }, [])

  function renderItems(n: number) {
    let retval = []
    let n1 = props.letterCount
    for (let i = 0; i < n1; i++) {
      retval.push(<div className={"letterBox " + CLASS_CODES[colorMatrix[n][i] || 0]} key={i}></div>)
    }
    return retval
  }

  return (
    <div className="App">
      <h1>WESTWORDLE</h1>
      <div id="outerguess">
      <div id="guesscont">
      <div className="lettersCont">
        {renderItems(0)}
      </div>
      <div className="lettersCont">
        {renderItems(1)}
      </div>
      <div className="lettersCont">
        {renderItems(2)}
      </div>
      <div className="lettersCont">
        {renderItems(3)}
      </div>
      <div className="lettersCont">
        {renderItems(4)}
      </div>
      <div className="lettersCont">
        {renderItems(5)}
      </div>
      </div>
      </div>
      <div id="keyboard"><div className="row"><button className='wrong' data-key="q">q</button><button className='rightLetter' data-key="w">w</button><button className='rightSpot' data-key="e">e</button><button data-key="r">r</button><button data-key="t">t</button><button data-key="y">y</button><button data-key="u">u</button><button data-key="i">i</button><button data-key="o">o</button><button data-key="p">p</button></div><div className="row"><div className="spacer half"></div><button data-key="a">a</button><button data-key="s">s</button><button data-key="d">d</button><button data-key="f">f</button><button data-key="g">g</button><button data-key="h">h</button><button data-key="j">j</button><button data-key="k">k</button><button data-key="l">l</button><div className="spacer half"></div></div><div className="row"><button data-key="↵" className="one-and-a-half">enter</button><button data-key="z">z</button><button data-key="x">x</button><button data-key="c">c</button><button data-key="v">v</button><button data-key="b">b</button><button data-key="n">n</button><button data-key="m">m</button><button data-key="←" className="one-and-a-half"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-backspace" viewBox="0 0 16 16">
  <path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z"/>
  <path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z"/>
</svg></button></div></div>
    </div>
  );
}

export default App;
