import "../styles/GameBoard.scss";
import { useState, useEffect } from "react";

const GameBoard = ({ socket, username, opponentName }) => {
  const [leftGame, setLeftGame] = useState(false);
  const [enemyDivs, setEnemyDivs] = useState([]);
  const [yourDivs, setYourDivs] = useState([]);
  //   const [guess, setGuess] = useState(0);
  //   const [gameStatus, setGameStatus] = useState(true);
  const yourShips = [];
  const enemyShips = [];

  // if (gameStatus === true) {
  // 	console.log('här försvinner div och spelet börjar')
  // }

  // if (gameStatus === false) {
  // 	console.log("div som täcker tills motståndare är ansluten")
  // }

  const generateShips = (squares, player) => {
    let ship = [];

    let randomPosition = Math.floor(Math.random() * 100);

    if (player === "you") {
      let startPosition = "y" + randomPosition;

      ship.push(startPosition);

      for (let i = 0; i < squares - 1; i++) {
        //   console.log("e" + randomPosition++);
        ship.push("y" + ++randomPosition);
      }

      if (yourShips[ship]) {
        generateShips();
      }

      console.log(ship);

      return [...ship];
    }

    if (player === "enemy") {
      let startPosition = "e" + randomPosition;

      ship.push(startPosition);

      for (let i = 0; i < squares - 1; i++) {
        //   console.log("e" + randomPosition++);
        ship.push("e" + ++randomPosition);
      }

      if (enemyShips.includes(ship)) {
        generateShips();
      }

      console.log(ship);

      return ship;
    }
  };

  console.log("dina skepp", yourShips);

  const postBoxClick = (id, clicked) => {
    if (clicked) {
      document.querySelector(`.${id}`).style.backgroundColor = "green";
      document.querySelector(`.${id}`).style.pointerEvents = "none";
    }

    if (!clicked) {
      document.querySelector(`.${id}`).style.backgroundColor = "red";
      document.querySelector(`.${id}`).style.pointerEvents = "none";
    }
  };

  const clickOnGrid = (e) => {
    // setGuess(guess + 1);

    if (enemyShips.includes(e.target.className)) {
      postBoxClick(e.target.className, true);
    }

    if (!enemyShips.includes(e.target.className)) {
      postBoxClick(e.target.className, false);
    }
  };

  const generateYourDivs = () => {
    const yourDivBoxes = [];
    for (let i = 0; i < 100; i++) {
      if (yourShips.includes("y" + i)) {
        yourDivBoxes.push(
          <div className={`y${i}`} key={`${i}`}>
            {i + " ⛵️"}
          </div>
        );
      } else {
        yourDivBoxes.push(
          <div className={`y${i}`} key={`${i}`}>
            {i}
          </div>
        );
      }
    }
    setYourDivs((yourDivs) => [...yourDivs, ...yourDivBoxes]);
  };

  const generateEnemyDivs = () => {
    const enemyDivBoxes = [];
    for (let i = 0; i < 100; i++) {
      enemyDivBoxes.push(
        <div className={`e${i}`} onClick={clickOnGrid} key={`${i}`}>
          {i}
        </div>
      );
    }
    setEnemyDivs((enemyDivs) => [...enemyDivs, ...enemyDivBoxes]);
  };

  console.log("dina skepp igen ", enemyDivs);

  //   document.querySelector(".y0").innerHTML = "hej";

  //   yourShips.forEach((e) => {
  //     console.log(e);
  //     // document.querySelector(`.${e}`).innerHTML = "⛵️";
  //     document.querySelector(".y1").innerHTML = "hej";
  //   });

  useEffect(() => {
    console.log("körs det ens");
    generateYourDivs();
    // console.log("i effect", enemyDivBoxes);
    generateEnemyDivs();
    // yourShips.push(...generateShips(4, "you"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   console.log("utanför effect", enemyDivBoxes);

  //   useEffect(() => {
  //     socket.on("player:disconnected", function (boolean) {
  //       setLeftGame(boolean);
  //     });
  //   }, [socket]);

  return (
    <div>
      <div>
        <h2>Let's play some Battleship!</h2>

        <p>{username} here</p>
        <p> {opponentName} somewhere</p>

        {/* Lets player know if opponent left game */}
        {leftGame === true && <h1>{opponentName} left the game</h1>}
      </div>
      <main>
        <section>
          <p>Your guesses: </p>
          <div className="yourBoard">{yourDivs}</div>
        </section>
        <section>
          <p>Enemy :P click on this board</p>
          <div className="enemyBoard">{enemyDivs}</div>
        </section>
      </main>
    </div>
  );
};

export default GameBoard;
