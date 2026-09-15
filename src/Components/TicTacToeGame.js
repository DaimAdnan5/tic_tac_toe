import { useEffect, useMemo, useState } from "react";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const EMPTY_BOARD = Array(9).fill(null);

function getResult(board) {
  for (const line of WIN_LINES) {
    const [first, second, third] = line;
    if (
      board[first] &&
      board[first] === board[second] &&
      board[first] === board[third]
    )
      return { winner: board[first], line };
  }
  return board.every(Boolean) ? { winner: "draw", line: [] } : null;
}

function getRandomMove(board) {
  const available = board.flatMap((cell, index) => (cell ? [] : [index]));
  return available[Math.floor(Math.random() * available.length)];
}

function getBestMove(board) {
  const minimax = (currentBoard, isMaximizing, depth) => {
    const result = getResult(currentBoard);
    if (result?.winner === "O") return 10 - depth;
    if (result?.winner === "X") return depth - 10;
    if (result?.winner === "draw") return 0;
    const scores = [];
    currentBoard.forEach((cell, index) => {
      if (cell) return;
      const nextBoard = [...currentBoard];
      nextBoard[index] = isMaximizing ? "O" : "X";
      scores.push(minimax(nextBoard, !isMaximizing, depth + 1));
    });
    return isMaximizing ? Math.max(...scores) : Math.min(...scores);
  };

  let bestScore = -Infinity;
  let move;
  board.forEach((cell, index) => {
    if (cell) return;
    const nextBoard = [...board];
    nextBoard[index] = "O";
    const score = minimax(nextBoard, false, 0);
    if (score > bestScore) {
      bestScore = score;
      move = index;
    }
  });
  return move;
}

function TicTacToeGame() {
  const [mode, setMode] = useState("ai");
  const [difficulty, setDifficulty] = useState("hard");
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [isXTurn, setIsXTurn] = useState(true);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ you: 0, draw: 0, opponent: 0 });
  const [history, setHistory] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const result = useMemo(() => getResult(board), [board]);
  const isGameOver = Boolean(result);
  const isAiTurn = mode === "ai" && !isXTurn && !isGameOver;

  const startRound = (nextRound = round + 1) => {
    setBoard(EMPTY_BOARD);
    setIsXTurn(true);
    setRound(nextRound);
    setHistory([]);
    setIsThinking(false);
  };

  useEffect(() => {
    if (!result) return;
    setScore((current) => ({
      ...current,
      ...(result.winner === "X" ? { you: current.you + 1 } : {}),
      ...(result.winner === "O" ? { opponent: current.opponent + 1 } : {}),
      ...(result.winner === "draw" ? { draw: current.draw + 1 } : {}),
    }));
  }, [result]);

  useEffect(() => {
    if (!isAiTurn) return;
    setIsThinking(true);
    const timer = window.setTimeout(() => {
      const move =
        difficulty === "easy" ? getRandomMove(board) : getBestMove(board);
      if (move === undefined) return;
      setHistory((current) => [...current, board]);
      setBoard((current) => {
        const next = [...current];
        next[move] = "O";
        return next;
      });
      setIsXTurn(true);
      setIsThinking(false);
    }, 430);
    return () => window.clearTimeout(timer);
  }, [board, difficulty, isAiTurn]);

  const handleCellClick = (index) => {
    if (board[index] || isGameOver || isAiTurn) return;
    setHistory((current) => [...current, board]);
    setBoard((current) => {
      const next = [...current];
      next[index] = isXTurn ? "X" : "O";
      return next;
    });
    setIsXTurn((current) => !current);
  };

  const undoMove = () => {
    if (!history.length || isThinking) return;
    const previousBoard =
      mode === "ai" && history.length > 1 ? history.at(-2) : history.at(-1);
    setBoard(previousBoard);
    setHistory((current) =>
      mode === "ai" && current.length > 1
        ? current.slice(0, -2)
        : current.slice(0, -1),
    );
    setIsXTurn(true);
  };

  const status = isThinking
    ? "Opponent is thinking..."
    : result?.winner === "draw"
      ? "Perfectly even"
      : result
        ? `${result.winner === "X" ? "You" : "Opponent"} take${result.winner === "X" ? "" : "s"} the round`
        : `${isXTurn ? "Your" : "Opponent's"} turn`;

  return (
    <section className="game-layout">
      <div className="intro-panel">
        <p className="eyebrow">TACTICAL BOARD GAME / 001</p>
        <h1>
          Think three
          <br />
          <em>moves</em> ahead.
        </h1>
        <p className="intro-copy">
          A focused game of pattern, pressure, and perfectly timed
          interruptions.
        </p>
        <div className="mode-switcher" aria-label="Game mode">
          <button
            className={mode === "ai" ? "active" : ""}
            onClick={() => {
              setMode("ai");
              startRound(1);
            }}
          >
            VS COMPUTER
          </button>
          <button
            className={mode === "local" ? "active" : ""}
            onClick={() => {
              setMode("local");
              startRound(1);
            }}
          >
            TWO PLAYERS
          </button>
        </div>
        {mode === "ai" && (
          <div className="difficulty-row">
            <span>DIFFICULTY</span>
            <div className="difficulty-buttons">
              {["easy", "hard"].map((level) => (
                <button
                  key={level}
                  className={difficulty === level ? "selected" : ""}
                  onClick={() => setDifficulty(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="legend">
          <span>
            <b className="legend-x">X</b> YOU
          </span>
          <span>
            <b className="legend-o">O</b> {mode === "ai" ? "CPU" : "PLAYER 2"}
          </span>
        </div>
      </div>
      <div className="board-panel">
        <div className="board-header">
          <div>
            <span className="status-dot" /> LIVE MATCH
          </div>
          <span>{status}</span>
        </div>
        <div className="board" role="grid" aria-label="Tic-tac-toe board">
          {board.map((cell, index) => (
            <button
              key={index}
              role="gridcell"
              aria-label={
                cell ? `Cell ${index + 1}: ${cell}` : `Cell ${index + 1}: empty`
              }
              className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ""} ${result?.line.includes(index) ? "winning-cell" : ""}`}
              onClick={() => handleCellClick(index)}
              disabled={Boolean(cell) || isGameOver || isAiTurn}
            >
              {cell}
            </button>
          ))}
        </div>
        <div className="board-actions">
          <button
            className="text-button"
            onClick={undoMove}
            disabled={!history.length || isThinking}
          >
            ↶ UNDO MOVE
          </button>
          <button className="primary-button" onClick={() => startRound()}>
            NEW ROUND <span>↗</span>
          </button>
        </div>
      </div>
      <aside className="stats-panel">
        <p className="eyebrow">MATCH LEDGER</p>
        <div className="score-list">
          <div>
            <span>YOU</span>
            <strong>{score.you}</strong>
          </div>
          <div>
            <span>DRAWS</span>
            <strong>{score.draw}</strong>
          </div>
          <div>
            <span>{mode === "ai" ? "CPU" : "PLAYER 2"}</span>
            <strong>{score.opponent}</strong>
          </div>
        </div>
        <div className="rule">
          <span>01</span>
          <p>Three marks in a row wins the round.</p>
        </div>
        <div className="rule">
          <span>02</span>
          <p>Every move changes the shape of the board.</p>
        </div>
        <div className="rule">
          <span>03</span>
          <p>Reset the round. Keep the score.</p>
        </div>
      </aside>
      <span className="round-value" aria-label={`Round ${round}`}>
        {String(round).padStart(2, "0")}
      </span>
    </section>
  );
}

export default TicTacToeGame;
