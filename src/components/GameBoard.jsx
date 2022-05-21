import "../styles/GameBoard.scss";
import { useState, useEffect } from "react";

const GameBoard = ({ socket, user, opponent }) => {
	const [gameOver, setGameOver] = useState(true);
	const [winner, setWinner] = useState("");

	const [leftGame, setLeftGame] = useState(false);
	const [guess, setGuess] = useState(0);
	const [gameStatus, setGameStatus] = useState(true);
	const yourDivBoxes = [];
	const enemyDivBoxes = [];
	const myShips = ["m91", "m92", "m93", "m94"];
	const enemyShips = ["e1", "e2", "e3", "e4"];

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
		// set ID for each type of ship and emit id for ship type
		if (enemyShips.includes(e.target.className)) {
			postBoxClick(e.target.className, true);
			socket.emit("player:shot-hit", e.target.className, user);
		}

		if (!enemyShips.includes(e.target.className)) {
			postBoxClick(e.target.className, false);
			socket.emit("player:shot-miss", e.target.className, user);
		}
	};

	for (let i = 0; i < 100; i++) {
		yourDivBoxes.push(<div className={`m${i}`} key={`${i}`}></div>);
	}

	for (let i = 0; i < 100; i++) {
		enemyDivBoxes.push(
			<div className={`e${i}`} onClick={clickOnGrid} key={`${i}`}></div>
		);
	}

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

	useEffect(() => {
		socket.on("player:disconnected", function (boolean) {
			setLeftGame(boolean);
		});

		console.log("USER", user);
		console.log("OPPONENT", opponent);

		// socket.on("player:hit", (id) => {
		// 	console.log("Its a hit", id);
		// 	shotReplied(id);
		// });

		// socket.on("player:missed", (id) => {
		// 	console.log("its a miss", id);
		// 	shotReplied(id);
		// });

		// Använd socket.off för att sluta lyssna på event. Kan användas på click så att det blir den andras tur?
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
					<p>Your guesses: {guess}</p>
					<div className="yourBoard">{yourDivBoxes}</div>
				</section>
				<section>
					<p>Enemy :P click on this board</p>
					<div className="enemyBoard">{enemyDivBoxes}</div>
				</section>
			</main>
		</div>
	);
};

export default GameBoard;
