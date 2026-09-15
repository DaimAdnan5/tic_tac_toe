import { useState } from "react";
import ConnectFour from "./Components/ConnectFour";
import MemoryMatch from "./Components/MemoryMatch";
import Navbar from "./Components/Navbar";
import TicTacToeGame from "./Components/TicTacToeGame";
import "./App.css";

const GAME_NAMES = {
  "tic-tac-toe": "GRID//NINE",
  memory: "PAIR//UP",
  "connect-four": "DROP//FOUR",
};

function App() {
  const [activeGame, setActiveGame] = useState("tic-tac-toe");

  const renderGame = () => {
    if (activeGame === "memory") return <MemoryMatch />;
    if (activeGame === "connect-four") return <ConnectFour />;
    return <TicTacToeGame />;
  };

  return (
    <main className="app-shell">
      <div className="noise" />
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">✕</span>
          <span>{GAME_NAMES[activeGame]}</span>
        </div>
        <div className="round-label">
          ARCADE{" "}
          <strong>
            /{String(Object.keys(GAME_NAMES).length).padStart(2, "0")}
          </strong>
        </div>
      </header>
      <Navbar activeGame={activeGame} onGameChange={setActiveGame} />
      {renderGame()}
      <footer>
        <span>DESIGNED FOR QUICK MINDS</span>
        <span>
          STATUS: <b>ONLINE</b>
        </span>
      </footer>
    </main>
  );
}

export default App;
