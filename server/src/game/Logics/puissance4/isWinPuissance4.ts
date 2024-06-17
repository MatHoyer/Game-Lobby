export const isWinPuissance4 = (board: string[][], player: string): boolean => {
  const rows = board.length;
  const cols = board[0].length;

  // Check horizontal
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 3; c++) {
      if (
        board[r][c] === player &&
        board[r][c + 1] === player &&
        board[r][c + 2] === player &&
        board[r][c + 3] === player
      ) {
        return true;
      }
    }
  }

  // Check vertical
  for (let r = 0; r < rows - 3; r++) {
    for (let c = 0; c < cols; c++) {
      if (
        board[r][c] === player &&
        board[r + 1][c] === player &&
        board[r + 2][c] === player &&
        board[r + 3][c] === player
      ) {
        return true;
      }
    }
  }

  // Check diagonal /
  for (let r = 3; r < rows; r++) {
    for (let c = 0; c < cols - 3; c++) {
      if (
        board[r][c] === player &&
        board[r - 1][c + 1] === player &&
        board[r - 2][c + 2] === player &&
        board[r - 3][c + 3] === player
      ) {
        return true;
      }
    }
  }

  // Check diagonal \
  for (let r = 3; r < rows; r++) {
    for (let c = 3; c < cols; c++) {
      if (
        board[r][c] === player &&
        board[r - 1][c - 1] === player &&
        board[r - 2][c - 2] === player &&
        board[r - 3][c - 3] === player
      ) {
        return true;
      }
    }
  }

  return false;
};
