import CONSTANTS from "../../common/constants";
import BoardItem from "../board-item/board-item";
import styles from "./board-grid.module.css";
import React from "react";

const checkWin = (player, board) => {
  for (let i = 0; i < CONSTANTS.WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = CONSTANTS.WINNING_COMBINATIONS[i];
    if (
      board[a].player === player &&
      board[b].player === player &&
      board[c].player === player
    ) {
      return true;
    }
  }
  return false;
};

const BoardGrid = (props) => {
  const { board, setBoard, setWinPlayer, winPlayer, player, setPlayer } = props;

  const [chosenPlayer, setChosenPlayer] = React.useState(CONSTANTS.PLAYER_X);

  const handleClick = (index) => {
    // check if the player property is not null
    if (board[index].player || player !== chosenPlayer) {
      // exit from the function without doing anything
      return;
    }

    // outdated because its updating the CONSTANTS.BOARD_GRID by reference
    // board[index].player = player;
    // const newBoard = [...board];
    const newBoard = board.map((item) => {
      if (item.index === index) {
        return {
          ...item,
          player,
        };
      }
      return item;
    });
    setBoard(newBoard);

    // check if the real player has matched a winning combination
    const hasPlayerWon = checkWin(player, newBoard);
    if (hasPlayerWon) {
      // We set the win player that is used in the parent component
      setWinPlayer(player);
      setPlayer(CONSTANTS.PLAYER_X);
      return;
    }

    // we check first the type of the player chosen at main menu
    setPlayer(
      chosenPlayer === CONSTANTS.PLAYER_X
        ? CONSTANTS.PLAYER_O
        : CONSTANTS.PLAYER_X
    );
  };

  React.useEffect(() => {
    if (player !== chosenPlayer && winPlayer === null) {
      const timer = setTimeout(() => {
        const emptyItems = board.filter((item) => item.player === null);

        if (emptyItems.length === 0) {
          return;
        }

        const randomIndex = Math.floor(Math.random() * emptyItems.length);
        const currentItem = emptyItems[randomIndex];

        // board[item.index].player = player;
        // const newBoard = [...board];
        const newBoard = board.map((item) => {
          if (item.index === currentItem.index) {
            return {
              ...item,
              player,
            };
          }
          return item;
        });
        setBoard(newBoard);

        // check if the boot player has matched a winning combination
        const hasPlayerWon = checkWin(player, newBoard);
        if (hasPlayerWon) {
          // We set the win player that is used in the parent component
          setWinPlayer(player);
          setPlayer(CONSTANTS.PLAYER_X);
          return;
        }

        setPlayer(
          chosenPlayer === CONSTANTS.PLAYER_X && player !== CONSTANTS.PLAYER_O
            ? CONSTANTS.PLAYER_O
            : CONSTANTS.PLAYER_X
        );
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    player,
    board,
    chosenPlayer,
    setBoard,
    setWinPlayer,
    winPlayer,
    setPlayer,
  ]);

  React.useEffect(() => {
    const lsChosenPlayer = localStorage.getItem(
      CONSTANTS.LOCAL_STORAGE.PLAYER_TYPE
    );
    setChosenPlayer(lsChosenPlayer);
  }, []);

  return (
    <div className={styles["container"]}>
      {board.map((item) => (
        <BoardItem
          key={item.id}
          index={item.index}
          player={item.player}
          isDisabled={player !== chosenPlayer}
          onClick={() => handleClick(item.index)}
        />
      ))}
    </div>
  );
};

export default BoardGrid;
