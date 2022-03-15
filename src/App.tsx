// import React from 'react';
import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import Popup from './Components/Popup/Popup'
import WORDS from './lib/words'
import Swal from 'sweetalert2'

interface propInterface {
  // letterCount: number;
  word: string
}

const CLASS_CODES = [
  "",
  "wrong",
  "rightLetter",
  "rightSpot"
]

// const WORD = "roccos"

const ANIM_DELAY = 0.5

function App(props: propInterface) {

  const [guessCount, setGuessCount] = useState(0)
  const [colorMatrix, setColorMatrix] = useState<number[][]>([
    [],
    [],
    [],
    [],
    [],
    [],
  ])
  const [charMatrix, setCharMatrix] = useState<string[][]>([
    [],
    [],
    [],
    [],
    [],
    [],
  ])
  const [popupShown, setPopupShown] = useState(false) // TODO: eventually use create context to share this between child component
  const [gameDone, setGameDone] = useState(false)
  const [won, setWon] = useState(false)

  async function checkDict(word: string) {
    return await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(res => res.status)
      // .then(res => res.json()).then(response => response.message)
  }

  // const handleKeyDown = useCallback((char: string) => {
  async function handleKeyDown(char: string) { // TODO: PUT THESE FUNCTIONS IN USE EFFECT (?)
    if (char === "Enter") char = '↵'
    if (char === "Backspace") char = '←'
    const checker = new RegExp('^[a-zA-Z←↵]{1}$')
    if (!checker.test(char) || guessCount === 6) { // not a valid key or used up guesses
      return
    }
    if (gameDone) return
    if (char === '↵') {
      if (charMatrix[guessCount].length !== props.word.length) return
      // if ()
      // let wordGuess:any = charMatrix[guessCount]
      // wordGuess = wordGuess.join('')
      let wordGuess: string = charMatrix[guessCount].join('')
      let res = await checkDict(wordGuess)
      // console.log(res);
      // console.log(wordGuess);
      
      if (res !== 200 && !WORDS.includes(wordGuess.toLowerCase())) {
        // console.log("bad");
        Swal.fire({
          title: 'Not a valid word!',
          icon: 'error'
        })
        return
      }
      guess(wordGuess)
      
      return
    }
    if (char === '←') {
      if (charMatrix[guessCount].length === 0) return
      let cpy = charMatrix[guessCount]
      cpy.pop()
      setCharMatrix(prev => {
        prev[guessCount] = cpy
        return [...prev]
      })
      return
    }
    if (charMatrix[guessCount].length === props.word.length) { // last position
      return
    }
    let cpy = charMatrix[guessCount]
    cpy.push(char)
    setCharMatrix(prev => {
      prev[guessCount] = cpy
      return [...prev]
    })
    // forceUpdate()
  }

  const actuallyHandleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault()
    handleKeyDown(e.key)
  }, [guessCount, gameDone])

  function guess(guess: string) { // PUT THESE FUNCTIONS IN USE EFFECT (?)
    guess = guess.toLowerCase()
    let guessrow: number[] = new Array(props.word.length).fill(0)
    let ignore = []
    let ignorepos: number[] = []
    for (let i = 0; i < props.word.length; i++) {
      if (guess[i] === props.word[i]) {
        guessrow[i] = 3
        ignore.push(i)
        ignorepos.push(i)
      }
    }
    for (let i = 0; i < props.word.length; i++) {
      if (ignore.includes(i)) continue;
      let pos = props.word.indexOf(guess[i])
      while (pos !== -1) {
        // if (!ignore.includes(i)) {
        if (!ignorepos.includes(pos)) {
          guessrow[i] = 2
          // ignore.push(i)
          ignorepos.push(pos)
          break;
        }
        pos = props.word.indexOf(guess[i], pos + 1)
      }
    }
    guessrow = guessrow.map((v) => {
      if (v === 0) {
        return 1
      }
      return v
    })
    // let keys = Array.from(document.querySelectorAll('#keyboard button'))
    // keys.forEach(el => {
    // })
    setTimeout(() => {
      guessrow.forEach((item, index) => {
        let key = document.querySelector(`[data-key='${guess[index]}']`)
        if (key) {
          if (key.classList.contains('rightSpot')) {

          } else if (key.classList.contains('rightLetter')) {
            if (item === 3) {
              key.classList.remove('rightLetter')
              key.classList.add('rightSpot')
            }
          } else if (key.classList.contains('wrong')) {
            if (item > 1) {
              key.classList.remove('wrong')
              key.classList.add(CLASS_CODES[item])
            }
          } else {
            key.classList.add(CLASS_CODES[item])
            // key.classList.toggle(CLASS_CODES[item])
          }
        }
      })
      const correctGuess = guessrow.every(item => item === 3)
      if (correctGuess) {
        setWon(true)
        setPopupShown(true)
        setGameDone(true)
      } else if (guessCount === 5) {
        setPopupShown(true)
        setGameDone(true)
        // TODO: show pop up with correct answer
      }
    }, (props.word.length * ANIM_DELAY + 0.2) * 1000)
    setColorMatrix(current => {
      current[guessCount] = guessrow
      return current
    })
    setGuessCount(current => current + 1)
    // forceUpdate()
    // console.log(colorMatrix)
  }
//   const [, updateState] = useState<any>()
//   const forceUpdate = useCallback(() => updateState({}), [])

  function setOuter() {
    let outer = document.getElementById('outerguess')// = (window.innerHeight - 290).toString() + 'px'
    if (outer) {
      outer.style.height = (window.innerHeight - 290).toString() + 'px'
    }
  }

  useEffect(() => {
    setOuter()
    window.onresize = setOuter
  }, [])

  useEffect(() => {
    // console.log(guessCount);
    // guess('paapyp')
    document.documentElement.style.setProperty('--letterCount', props.word.length.toString())
    // window.addEventListener('keydown', (e: KeyboardEvent) => {e.preventDefault();handleKeyDown(e.key)})
    window.addEventListener('keydown', actuallyHandleKeyDown)
    // let keys = Array.from(document.getElementsByTagName('button'))
    let keys = Array.from(document.querySelectorAll('button:not(#shareButton)'))
    keys.forEach(el => {
      el.addEventListener('click', () => handleKeyDown(el.getAttribute('data-key') || ''))
    })

    return () => {
      // window.removeEventListener('keydown', (e: KeyboardEvent) => {e.preventDefault();handleKeyDown(e.key)})
      window.removeEventListener('keydown', actuallyHandleKeyDown)
      // Array.from(document.getElementsByTagName('button')).forEach(el => {
        Array.from(document.querySelectorAll('button:not(#shareButton)')).forEach(el => {
        // el.removeEventListener('click', () => handleKeyDown(el.getAttribute('data-key') || ''))
        // el.removeEventListener('click', () => actuallyHandleButtonPress(el.getAttribute('data-key') || ''))
        el.replaceWith(el.cloneNode(true))
      })
    }
  }, [guessCount, gameDone])

  function renderItems(n: number) {
    let retval = []
    let n1 = props.word.length
    for (let i = 0; i < n1; i++) {
      retval.push(<div style={{transitionDelay: `${i * ANIM_DELAY}s`}} className={"letterBox " + CLASS_CODES[colorMatrix[n][i] || 0]} key={i}>{charMatrix[n][i] || ''}</div>)
    }
    return retval
  }

  return (
    <div className="App"  tabIndex={0}>
      <h1>WESTWORDLE</h1>
      <Popup answer={props.word} won={won} setPopupShown={setPopupShown} popupShown={popupShown} colorMatrix={colorMatrix}></Popup>
      <div id="outerguess">
      <div id="guesscont">
      <div className="lettersCont">
        {renderItems(0)}
        {/* {charMatrix[0].map((item, i) => {
            return <div className={"letterBox " + CLASS_CODES[colorMatrix[0][i] || 0]} key={i}>{charMatrix[0][i] || ''}</div>
        })} */}
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
      <div id="keyboard"><div className="row"><button data-key="q">q</button><button data-key="w">w</button><button data-key="e">e</button><button data-key="r">r</button><button data-key="t">t</button><button data-key="y">y</button><button data-key="u">u</button><button data-key="i">i</button><button data-key="o">o</button><button data-key="p">p</button></div><div className="row"><div className="spacer half"></div><button data-key="a">a</button><button data-key="s">s</button><button data-key="d">d</button><button data-key="f">f</button><button data-key="g">g</button><button data-key="h">h</button><button data-key="j">j</button><button data-key="k">k</button><button data-key="l">l</button><div className="spacer half"></div></div><div className="row"><button data-key="↵" className="one-and-a-half">enter</button><button data-key="z">z</button><button data-key="x">x</button><button data-key="c">c</button><button data-key="v">v</button><button data-key="b">b</button><button data-key="n">n</button><button data-key="m">m</button><button data-key="←" className="one-and-a-half"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-backspace" viewBox="0 0 16 16">
  <path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z"/>
  <path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z"/>
</svg></button></div></div>
    </div>
  );
}

export default App;
