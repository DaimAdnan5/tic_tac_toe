import { useMemo, useState } from "react";

const ROWS = 6;
const COLUMNS = 7;
const EMPTY_GRID = Array.from({ length: ROWS }, () =>
  Array(COLUMNS).fill(null),
);

function getWinner(grid, row, column, player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  return directions.some(([rowStep, columnStep]) => {
    let total = 1;
    for (const direction of [-1, 1]) {
      let nextRow = row + rowStep * direction;
      let nextColumn = column + columnStep * direction;
      while (
        nextRow >= 0 &&
        nextRow < ROWS &&
        nextColumn >= 0 &&
        nextColumn < COLUMNS &&
        grid[nextRow][nextColumn] === player
      ) {
        total += 1;
        nextRow += rowStep * direction;
        nextColumn += columnStep * direction;
      }
    }
    return total >= 4;
  });
}

function ConnectFour() {
  const [grid, setGrid] = useState(EMPTY_GRID);
  const [player, setPlayer] = useState("red");
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ red: 0, yellow: 0 });

  const isDraw = useMemo(
    () => !winner && grid.every((row) => row.every(Boolean)),
    [grid, winner],
  );
  const dropDisc = (column) => {
    if (winner || isDraw) return;
    const row = [...grid]
      .map((currentRow) => [...currentRow])
      .reverse()
      .findIndex((currentRow) => !currentRow[column]);
    if (row === -1) return;
    const actualRow = ROWS - 1 - row;
    const nextGrid = grid.map((currentRow) => [...currentRow]);
    nextGrid[actualRow][column] = player;
    setGrid(nextGrid);
    if (getWinner(nextGrid, actualRow, column, player)) {
      setWinner(player);
      setScore((current) => ({ ...current, [player]: current[player] + 1 }));
    } else setPlayer((current) => (current === "red" ? "yellow" : "red"));
  };
  const reset = () => {
    setGrid(EMPTY_GRID);
    setPlayer("red");
    setWinner(null);
  };
  const status = winner
    ? `${winner.toUpperCase()} PLAYER WINS`
    : isDraw
      ? "BOARD LOCKED"
      : `${player.toUpperCase()} PLAYER'S TURN`;

  return (
    <section className="secondary-game connect-game">
      <div className="secondary-copy">
        <p className="eyebrow">DROP FOUR / 003</p>
        <h1>
          Build a<br />
          <em>line.</em>
        </h1>
        <p className="intro-copy">
          Drop your discs. Connect four before the board runs out of space.
        </p>
        <div className="game-metrics">
          <div>
            <span>RED WINS</span>
            <strong>{score.red}</strong>
          </div>
          <div>
            <span>YELLOW WINS</span>
            <strong>{score.yellow}</strong>
          </div>
        </div>
        <button className="primary-button" onClick={reset}>
          NEW BOARD <span>↗</span>
        </button>
      </div>
      <div className="connect-panel">
        <div className="board-header">
          <div>
            <span className="status-dot" /> CONNECT FOUR
          </div>
          <span>{status}</span>
        </div>
        <div className="connect-grid">
          {Array.from({ length: COLUMNS }, (_, column) => (
            <button
              key={column}
              className="drop-column"
              aria-label={`Drop in column ${column + 1}`}
              onClick={() => dropDisc(column)}
            >
              {grid.map((row, index) => (
                <span key={index} className={`disc ${row[column] || ""}`} />
              ))}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ConnectFour;
