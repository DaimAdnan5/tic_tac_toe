# GRID//NINE

An arcade of focused React games. The app includes tic-tac-toe, memory matching, and Connect Four, all reachable from the shared navbar. The tic-tac-toe game includes computer and local multiplayer modes, difficulty settings, score persistence across rounds, undo, winning-cell highlighting, responsive layout, and accessible board controls.

## Run it

```bash
npm install
npm start
```

Open `http://localhost:3000` in your browser. For a production bundle:

```bash
npm run build
```

The test suite can be run once with:

```bash
npm test -- --watchAll=false --runInBand
```

## How it is built

### Component navigation

`App` owns only the active game id and shared page shell. `Navbar` receives that id plus an `onGameChange` callback, so selecting a game swaps the rendered component without adding a routing dependency. Each game owns its own state and rules, which keeps a change to one game from affecting the others.

### 1. The board is data

The board is a nine-item array. An empty square is `null`, while played squares contain `X` or `O`:

```js
['X', null, 'O', null, 'X', null, null, 'O', null]
```

React renders one button for each array item. Clicking a button creates a new array instead of mutating the old one, which gives React a clear state change to render.

### 2. One win checker drives tic-tac-toe

`getResult(board)` checks the eight possible winning lines. It returns the winner and the winning indexes, or a draw when all nine cells are filled. The same result powers the status message, score update, disabled game state, and highlighted winning cells.

### 3. The computer has two personalities

- **Easy** chooses randomly from the available cells.
- **Hard** uses the minimax algorithm. It simulates future `O` and `X` moves, scores wins higher than draws, and prefers faster wins or slower losses. This makes the hard opponent unbeatable when it starts from a fair board.

The computer move is delayed by 430ms so the interface communicates that it is thinking instead of changing instantly.

### 4. The other games have local rules

Memory Match creates a shuffled pair deck and tracks two flipped cards before checking for a match. Connect Four stores a six-by-seven grid, drops discs to the lowest open row, and checks four directions after every move.

### 5. React state separates concerns

`App` stores the active board, turn, mode, difficulty, round number, score, move history, and thinking state. Derived values such as `result`, `isGameOver`, and `isAiTurn` are calculated from that state rather than stored separately, which prevents contradictory states.

The history array stores previous board snapshots. In computer mode, undo removes the player's move and the computer response together, returning control to the player.

### 6. The visual design is CSS-only

`App.css` defines the layout, colors, typography, board interactions, responsive breakpoints, and the subtle paper texture. The desktop view uses a three-column composition; at smaller widths it stacks the board first so the main action remains easy to reach.

## Main files

- `src/App.js` contains the shared shell and active-game navigation state.
- `src/Components/Navbar.js` renders the game selector.
- `src/Components/TicTacToeGame.js` contains tic-tac-toe rules, AI, and controls.
- `src/Components/MemoryMatch.js` contains the matching game state and deck logic.
- `src/Components/ConnectFour.js` contains the grid, drop logic, and win detection.
- `src/App.css` contains the shared visual system and responsive layouts.
- `src/index.css` contains the global reset and base typeface.
- `src/App.test.js` verifies that the playable board renders with nine accessible cells.

## Good next extensions

The architecture is ready for timed matches, player names, persistent scores with `localStorage`, a larger 4x4 variant, or an online mode backed by a server. The win-line function is the natural place to generalize board dimensions, while the move-selection function is the natural boundary for another AI strategy.
