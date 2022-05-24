import "../styles/GameBoard.scss";
import { createBoard } from "../helpers/helpers";
import { useState, useEffect } from "react";

const GameBoard = ({ socket, user, opponent }) => {
	const [leftGame, setLeftGame] = useState(false);

	const yourDivBoxes = [];
	const enemyDivBoxes = [];

	const [yourDivs, setYourDivs] = useState([]);
	const [enemyDivs, setEnemyDivs] = useState([]);

	const [yourShips, setYourShips] = useState([]);
	const [enemyShips, setEnemyShips] = useState([]);

	// createBoard(myDivBoxes, "m");
	// createBoard(enemyDivBoxes, "e");

	/* generera dina skepp */

	const generateYourShips = (squares) => {
		let ship = [];
		let randomPosition = Math.floor(Math.random() * 100);
		let startPosition = "y" + randomPosition;

		ship.push(startPosition);

		for (let i = 0; i < squares - 1; i++) {
			//   console.log("e" + randomPosition++);
			ship.push("y" + ++randomPosition);
		}

		if (yourShips[ship]) {
			generateYourShips();
		}

		return setYourShips((yourShips) => [...yourShips, ...ship]);
	};

	/* generara motståndares skepp */

	const generateEnemyShips = (squares) => {
		let ship = [];

		let randomPosition = Math.floor(Math.random() * 100);

		let startPosition = "e" + randomPosition;

		ship.push(startPosition);

		for (let i = 0; i < squares - 1; i++) {
			//   console.log("e" + randomPosition++);
			ship.push("e" + ++randomPosition);
		}

		if (enemyShips.includes(ship)) {
			generateEnemyShips();
		}

		return setEnemyShips((enemyShips) => [...enemyShips, ...ship]);
	};

	/* generera divar till din grid */

	const generateYourDivs = () => {
		// const yourDivBoxes = [];
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
		return setYourDivs((yourDivs) => [...yourDivs, ...yourDivBoxes]);
	};

	/* generera divar till motståndares grid */

	const generateEnemyDivs = () => {
		// const enemyDivBoxes = [];
		for (let i = 0; i < 100; i++) {
			enemyDivBoxes.push(
				<div className={`e${i}`} onClick={clickOnGrid} key={`${i}`}>
					{i}
				</div>
			);
		}
		return setEnemyDivs((enemyDivs) => [...enemyDivs, ...enemyDivBoxes]);
	};

	/* funktion då spelare trycker på en ruta i grid */

	const clickOnGrid = (e) => {
		// setGuess(guess + 1);

		if (enemyShips.includes(e.target.className)) {
			postBoxClick(e.target.className, true);
			console.log(e.target.className);
			console.log("träff");
		}

		if (!enemyShips.includes(e.target.className)) {
			postBoxClick(e.target.className, false);
			console.log(e.target.className);
			console.log("miss");
		}
	};

	/* funktion som tar emot ifall det blev träff eller miss */

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

	// const clickOnGrid = (e) => {
	// 	socket.emit("player:shot-fired", e.target.dataset.id);
	// 	console.log(e.target.dataset.id);
	// };

	// const handleHit = (target) => {
	// 	document.querySelector(`.m${target}`).style.backgroundColor = "red";
	// 	document.querySelector(`.m${target}`).style.pointerEvents = "none";

	// 	socket.emit("player:shot-reply", target, socket.id);
	// };

	// const handleMiss = (target) => {
	// 	document.querySelector(`.m${target}`).style.backgroundColor = "black";
	// 	document.querySelector(`.m${target}`).style.pointerEvents = "none";

	// 	socket.emit("player:shot-reply", target, socket.id);
	// };

	const playerLeftGame = (boolean) => {
		setLeftGame(boolean);
	};

	useEffect(() => {
		generateYourShips(4);
		generateEnemyShips(4);
		generateYourDivs();
		generateEnemyDivs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		socket.on("player:disconnected", playerLeftGame);

		// socket.on("player:hit", handleHit);

		// socket.on("player:miss", handleMiss);
	}, [socket, user, opponent]);

	return (
		<div>
			<div>
				<h2>Let's play some Battleship!</h2>

				{user && opponent ? (
					<p>
						<span>{user.username}</span> vs <span>{opponent.username}</span>
					</p>
				) : (
					<p>Waiting for another player...</p>
				)}

				{/* Lets player know if opponent left game */}
				{leftGame === true && <h1>{opponent.username} left the game</h1>}
			</div>
			<main>
				<section>
					<h3>Your board</h3>
					{/* <div className="yourBoard">{myDivBoxes}</div> */}
					<div className="yourBoard">{yourDivs}</div>
				</section>
				<section>
					<h3>Enemy board</h3>
					{/* <div className="enemyBoard" onClick={clickOnGrid}>
						{enemyDivBoxes}
					</div> */}
					<div className="enemyBoard" onClick={clickOnGrid}>
						{enemyDivs}
					</div>
				</section>
			</main>
		</div>
	);
};

export default GameBoard;
