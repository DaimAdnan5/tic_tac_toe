import { useEffect, useMemo, useState } from "react";

const SYMBOLS = ["✦", "◒", "△", "✚", "◇", "☼"];
const createDeck = () =>
  [...SYMBOLS, ...SYMBOLS]
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({ id: index, symbol, matched: false }));

function MemoryMatch() {
  const [cards, setCards] = useState(createDeck);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (flipped.length !== 2) return undefined;
    const [first, second] = flipped.map((index) => cards[index]);
    if (first.symbol === second.symbol) {
      setCards((current) =>
        current.map((card, index) =>
          flipped.includes(index) ? { ...card, matched: true } : card,
        ),
      );
      setFlipped([]);
      return undefined;
    }
    const timer = window.setTimeout(() => setFlipped([]), 700);
    return () => window.clearTimeout(timer);
  }, [cards, flipped]);

  const pairs = useMemo(
    () => cards.filter((card) => card.matched).length / 2,
    [cards],
  );
  const isComplete = pairs === SYMBOLS.length;

  const chooseCard = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || cards[index].matched)
      return;
    setFlipped((current) => [...current, index]);
    if (flipped.length === 1) setMoves((current) => current + 1);
  };

  const reset = () => {
    setCards(createDeck());
    setFlipped([]);
    setMoves(0);
  };

  return (
    <section className="secondary-game memory-game">
      <div className="secondary-copy">
        <p className="eyebrow">PATTERN RECOGNITION / 002</p>
        <h1>
          Keep your
          <br />
          <em>pattern</em> sharp.
        </h1>
        <p className="intro-copy">
          Find every matching pair using the fewest possible turns.
        </p>
        <div className="game-metrics">
          <div>
            <span>PAIRS</span>
            <strong>
              {pairs}/{SYMBOLS.length}
            </strong>
          </div>
          <div>
            <span>MOVES</span>
            <strong>{moves}</strong>
          </div>
        </div>
        <button className="primary-button" onClick={reset}>
          SHUFFLE DECK <span>↗</span>
        </button>
      </div>
      <div className="memory-panel">
        <div className="board-header">
          <div>
            <span className="status-dot" /> MEMORY DECK
          </div>
          <span>{isComplete ? "Deck cleared" : "Find the pairs"}</span>
        </div>
        <div className="memory-grid">
          {cards.map((card, index) => {
            const isVisible = flipped.includes(index) || card.matched;
            return (
              <button
                key={card.id}
                className={`memory-card ${isVisible ? "visible" : ""} ${card.matched ? "matched" : ""}`}
                onClick={() => chooseCard(index)}
                aria-label={isVisible ? `Card ${card.symbol}` : "Hidden card"}
              >
                {isVisible ? card.symbol : "?"}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MemoryMatch;
