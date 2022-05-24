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

	console.log(yourShips);

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
				<div className={`e${i}`} key={`${i}`}>
					{i}
				</div>
			);
		}
		return setEnemyDivs((enemyDivs) => [...enemyDivs, ...enemyDivBoxes]);
	};

	/* funktion då spelare trycker på en ruta i grid */

	// const clickOnGrid = (e) => {
	// 	// setGuess(guess + 1);

	// 	if (enemyShips.includes(e.target.className)) {
	// 		postBoxClick(e.target.className, true);
	// 		console.log(e.target.className);
	// 		console.log("träff");
	// 	}

	// 	if (!enemyShips.includes(e.target.className)) {
	// 		postBoxClick(e.target.className, false);
	// 		console.log(e.target.className);
	// 		console.log("miss");
	// 	}
	// };

	/* funktion som tar emot ifall det blev träff eller miss */

	// const postBoxClick = (id, clicked) => {
	// 	if (clicked) {
	// 		document.querySelector(`.${id}`).style.backgroundColor = "green";
	// 		document.querySelector(`.${id}`).style.pointerEvents = "none";
	// 	}

	// 	if (!clicked) {
	// 		document.querySelector(`.${id}`).style.backgroundColor = "red";
	// 		document.querySelector(`.${id}`).style.pointerEvents = "none";
	// 	}
	// };

	const clickOnGrid = (e) => {
		socket.emit("player:shot-fired", e.target.className);
		console.log(e.target.className);
	};

	const handleShotFired = (id) => {
		const target = id.replace("e", "y");
		const hit = yourShips.includes(target);

		console.log("TARGET?", target);

		console.log("HIT?", hit);

		if (hit) {
			console.log(`You shot at ${target} and it's a HIT!`);

			document.querySelector(`.${target}`).style.backgroundColor = "green";
			document.querySelector(`.${target}`).style.pointerEvents = "none";

			socket.emit("player:shot-reply", target, true);
		} else {
			console.log(`You shot at ${target} and it's a MISS!`);

			document.querySelector(`.${target}`).style.backgroundColor = "red";
			document.querySelector(`.${target}`).style.pointerEvents = "none";

			socket.emit("player:shot-reply", target, false);
		}
	};

	const handleShotReceived = (id, boolean) => {
		console.log(`Your opponent shot at ${id} and it's ${boolean}`);
		const target = id.replace("y", "e");

		if (boolean === false) {
			document.querySelector(`.${target}`).style.backgroundColor = "red";
			document.querySelector(`.${target}`).style.pointerEvents = "none";
		} else {
			document.querySelector(`.${target}`).style.backgroundColor = "green";
			document.querySelector(`.${target}`).style.pointerEvents = "none";
		}

		// const target = id.replace("e", "y");

		// if (boolean) {
		// 	document.querySelector(`.${target}`).style.backgroundColor = "green";
		// 	document.querySelector(`.${target}`).style.pointerEvents = "none";
		// } else {
		// 	document.querySelector(`.${target}`).style.backgroundColor = "red";
		// 	document.querySelector(`.${target}`).style.pointerEvents = "none";
		// }
	};

	const playerLeftGame = (boolean) => {
		setLeftGame(boolean);
	};

	useEffect(() => {
		generateYourShips(4);

		generateYourDivs();
		generateEnemyDivs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		socket.on("player:disconnected", playerLeftGame);

		socket.on("player:fire", handleShotFired);

		socket.on("player:shot-received", handleShotReceived);
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
