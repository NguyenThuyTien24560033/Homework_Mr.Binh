export function checkWinner(board) {

    for (let row = 0; row < 5; row++) {

        let start = row * 5;

        if (
            board[start] !== "" &&
            board[start] === board[start + 1] &&
            board[start] === board[start + 2] &&
            board[start] === board[start + 3] &&
            board[start] === board[start + 4])
        {
            return { winner: board[start], winLine: { type: 'row', index: row } };
        }
    }

    for (let col = 0; col < 5; col++) {

        if (
            board[col] !== "" &&
            board[col] === board[col + 5] &&
            board[col] === board[col + 10] &&
            board[col] === board[col + 15] &&
            board[col] === board[col + 20])

        {
            return { winner: board[col], winLine: { type: 'col', index: col } };
        }
    }

    if (
        board[0] !== "" &&
        board[0] === board[6] &&
        board[0] === board[12] &&
        board[0] === board[18] &&
        board[0] === board[24])
    {
        return { winner: board[0], winLine: { type: 'diagonal-main', index: 0 } };
    }

    if (
        board[4] !== "" &&
        board[4] === board[8] &&
        board[4] === board[12] &&
        board[4] === board[16] &&
        board[4] === board[20])

    {
        return { winner: board[4], winLine: { type: 'diagonal-sub', index: 0 } };
    }

    return null;
}