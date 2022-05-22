import "../styles/GameBoard.scss";
import { useState, useEffect } from "react";

const GameBoard = ({ socket, user, opponent }) => {
	const [gameOver, setGameOver] = useState(true);
	const [winner, setWinner] = useState("");
	const [leftGame, setLeftGame] = useState(false);

	const [shotFired, setShotFired] = useState("");

	const [guess, setGuess] = useState(0);
	const [gameStatus, setGameStatus] = useState(true);
	const myDivBoxes = [];
	const enemyDivBoxes = [];
	const myShips = ["m91", "m92", "m93", "m94"];
	const enemyShips = ["e1", "e2", "e3", "e4"];

	for (let i = 0; i < 100; i++) {
		enemyDivBoxes.push(
			<div
				className={`e${i}`}
				data-id={i}
				// onClick={clickOnGrid}
				key={`${i}`}
			></div>
		);
	}

	for (let i = 0; i < 100; i++) {
		myDivBoxes.push(<div className={`m${i}`} data-id={i} key={`${i}`}></div>);
	}

	// if (gameStatus === true) {
	// 	console.log('här försvinner div och spelet börjar')
	// }

	// if (gameStatus === false) {
	// 	console.log("div som täcker tills motståndare är ansluten")
	// }

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
		setGuess(guess + 1);

		console.log(`${socket.id} clicked on ${e.target.dataset.id}`);

		socket.emit("player:shot-fired", e.target.dataset.id);

		// set ID for each type of ship and emit id for ship type
		// if (enemyShips.includes(e.target.className)) {
		// 	postBoxClick(e.target.className, true);
		// 	setShotFired(e.target.className);
		// 	socket.emit("player:shot-hit", shotFired);
		// }

		// if (!enemyShips.includes(e.target.className)) {
		// 	postBoxClick(e.target.className, false);
		// 	setShotFired(e.target.className);
		// 	socket.emit("player:shot-miss", shotFired);
		// }
	};

	const handleShotFired = (id) => {
		const boxFiredAt = myDivBoxes.find((div) => div.key === id);
		const hitBox = boxFiredAt.props.className.replace("m", "e");

		if (enemyShips.includes(hitBox)) {
			document.querySelector(`.m${id}`).style.backgroundColor = "green";
			document.querySelector(`.m${id}`).style.pointerEvents = "none";
		} else {
			document.querySelector(`.m${id}`).style.backgroundColor = "red";
			document.querySelector(`.m${id}`).style.pointerEvents = "none";
		}

		socket.emit("player:shot-reply", hitBox);
	};

	const revealFireOnMyBoard = (id) => {
		console.log(id);
		// const revealBox = id.className.replace("m", "e");

		// if (enemyShips.includes(revealBox)) {
		// 	document.querySelector(`.e${id}`).style.backgroundColor = "green";
		// 	document.querySelector(`.e${id}`).style.pointerEvents = "none";
		// }

		// console.log(revealBox);
	};

	// const shotReplied = (id) => {
	// 	if (myShips.includes(id)) {
	// 		document.querySelector(`.${id}`).style.backgroundColor = "green";
	// 		document.querySelector(`.${id}`).style.pointerEvents = "none";
	// 	}

	// 	if (!myShips.includes(id)) {
	// 		document.querySelector(`.${id}`).style.backgroundColor = "red";
	// 		document.querySelector(`.${id}`).style.pointerEvents = "none";
	// 	}
	// };

	// yourShips.forEach(e => {
	// 	console.log(e)
	// 	document.querySelector(`.${e}`).style.backgroundColor = 'blue'
	// })

	const playerLeftGame = (boolean) => {
		setLeftGame(boolean);
	};

	useEffect(() => {
		socket.on("player:disconnected", playerLeftGame);

		socket.on("player:fire", handleShotFired);

		socket.on("player:fire-reveal", revealFireOnMyBoard);

		// socket.on("player:hit", (id) => {
		// 	shotReplied(id);
		// });

		// socket.on("player:missed", (id) => {
		// 	shotReplied(id);
		// });
	}, [socket, user, opponent]);

	return (
		<div>
			<div>
				<h2>Let's play some Battleship!</h2>

				{user && opponent ? (
					<p>
						<span style={{ color: "red" }}>{user.username}</span> vs{" "}
						<span>{opponent.username}</span>
					</p>
				) : (
					<p>Waiting for another player...</p>
				)}

				{/* Lets player know if opponent left game */}
				{leftGame === true && <h1>{opponent.username} left the game</h1>}
			</div>
			<main>
				<section>
					<p>Your guesses: {guess}</p>
					<div className="yourBoard">{myDivBoxes}</div>
				</section>
				<section>
					<p>Enemy :P click on this board</p>
					<div className="enemyBoard" onClick={clickOnGrid}>
						{enemyDivBoxes}
					</div>
				</section>
			</main>
		</div>
	);
};

export default GameBoard;
