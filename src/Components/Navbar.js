const games = [
  { id: "tic-tac-toe", label: "Tic-Tac-Toe", number: "01" },
  { id: "memory", label: "Memory Match", number: "02" },
  { id: "connect-four", label: "Connect Four", number: "03" },
];

function Navbar({ activeGame, onGameChange }) {
  return (
    <nav className="game-nav" aria-label="Game selection">
      <div className="nav-heading">
        <span className="nav-kicker">SELECT A GAME</span>
        <span className="nav-count">
          {String(games.length).padStart(2, "0")} MODES
        </span>
      </div>
      <div className="nav-links">
        {games.map((game) => (
          <button
            key={game.id}
            className={activeGame === game.id ? "nav-link active" : "nav-link"}
            onClick={() => onGameChange(game.id)}
            aria-current={activeGame === game.id ? "page" : undefined}
          >
            <span className="nav-number">{game.number}</span>
            <span>{game.label}</span>
            <span className="nav-arrow">↗</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
