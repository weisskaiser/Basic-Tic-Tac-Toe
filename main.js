const cells = document.querySelectorAll('.cell')

const banner = document.getElementById('banner')

var board = new Array(9).fill();

let currentPlayer = 'X'

const setBanner = text => {
    banner.textContent = text
}

const getPlaysLeft = board => {
    return board.filter(b => b === undefined).length
}

const getThenSwitchPlayer = () => {

    let player = currentPlayer;

    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X'

    return player;
}

const checkLine = (board, line) => {

    const start = line * 3;
    const first = board[start]

    if (first === undefined) return undefined

    for (let i = 1; i < 3; i++) {
        if (board[start + i] === undefined || board[start + i] !== first) {
            return undefined
        }
    }

    return first
}

const checkColumn = (board, column) => {

    const start = column;
    const first = board[start]

    if (first === undefined) return undefined

    for (let i = 1; i < 3; i++) {
        if (board[start + i * 3] === undefined || board[start + i * 3] !== first) {
            return undefined
        }
    }

    return first
}

const diagCheck = (board, diag) => {

    let start
    let inc

    if (diag === 0) {
        start = 0
        inc = 4
    } else if (diag === 1) {
        start = 2
        inc = 2
    } else {
        throw new Error(`Invalid state, diag as ${diag}`)
    }

    const first = board[start]

    if (first === undefined) return undefined

    for (let i = 1; i < 3; i++) {
        if (board[start + inc * i] === undefined || board[start + inc * i] !== first) {
            return undefined
        }
    }

    return first

}

const checkWinner = board => {

    for (let check of [checkLine, checkColumn]) {
        for (let i = 0; i < 3; i++) {
            const result = check(board, i)
            if (result !== undefined) {
                return result
            }
        }
    }

    for (let i = 0; i < 2; i++) {
        const result = diagCheck(board, i)
        if (result !== undefined) {
            return result
        }
    }

    return undefined
}

const gameTick = (cell, i, board) => {

    if (cell.textContent === "") {

        const player = getThenSwitchPlayer()
        board[i] = player
        cell.textContent = player
        cell.classList.remove('clickable')

        const winnerAfterPlay = checkWinner(board)

        let message
        let itsOver = false

        if (winnerAfterPlay !== undefined) {
            message = `We have a winner, congrats ${winnerAfterPlay}`
            itsOver = true
        } else if (getPlaysLeft(board) === 0) {
            message = "Just a tie, what a life..."
            itsOver = true
        } else {
            message = `Now playing ${player}`
        }

        setBanner(message)
        if (itsOver) {
            document.dispatchEvent(new Event('gameover'))
        }
    }
}

let eventListeners = []

cells.forEach((cell, i) => {

    eventListeners.push(e => gameTick(cell, i, board))
    cell.addEventListener('click', eventListeners[i])

})

document.addEventListener('gameover', e => {

    cells.forEach((cell, i) => {

        cell.removeEventListener('click', eventListeners[i])
        cell.classList.remove('clickable')

    })

})