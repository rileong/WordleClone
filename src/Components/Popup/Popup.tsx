import './popup.css'
// import { useState, useEffect } from 'react'

interface visible {
    setPopupShown: (param: boolean) => void
    popupShown: boolean
    colorMatrix: number[][]
}

const EMOJI_CODES = [
    '⬜',
    '⬛',
    '🟨',
    '🟦'
]

export default function Popup(props: visible) {

    function handlePopupClose() {
        // setVisible(prev => !prev)
        props.setPopupShown(false)
    }

    function renderText() {
        const d = new Date()
        let retString = `Westwordle ${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().substring(2)}\n`
        props.colorMatrix.forEach((row) => {
            row.forEach((color) => {
                retString = retString.concat(EMOJI_CODES[color])
            })
            retString = retString.concat('\n')
        })
        return retString
    }

    async function copyScore() {
        await navigator.clipboard.writeText(renderText())
    }

    return (
        <div className={`popup ${props.popupShown ? '' : 'notvisible'}`}>
            <p className='header'>Share your score!</p>
            <button id='shareButton' onClick={copyScore}>Copy</button>
            <p>{renderText()}</p>
            <svg onClick={handlePopupClose} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </div>
    )
}