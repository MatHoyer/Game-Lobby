export const isBoardFull = (board: string[][]) => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] !== '') {
        return false;
      }
    }
  }
  return true;
};
