import "../styles/GameBoard.scss";
import { useState, useEffect } from "react";

const GameBoard = ({ socket, user, opponent, username }) => {
	const [leftGame, setLeftGame] = useState(false);

	const myDivBoxes = [];
	const enemyDivBoxes = [];

	for (let i = 0; i < 100; i++) {
		enemyDivBoxes.push(
			<div className={`e${i}`} data-id={i} key={`${i}`}></div>
		);
	}

	for (let i = 0; i < 100; i++) {
		myDivBoxes.push(<div className={`m${i}`} data-id={i} key={`${i}`}></div>);
	}

	const clickOnGrid = (e) => {
		socket.emit("player:shot-fired", e.target.dataset.id);
		console.log(e.target.dataset.id);
	};

	const handleHit = (target, shooterName) => {
		if (shooterName === username) {
			document.querySelector(`.e${target}`).style.backgroundColor = "red";
			document.querySelector(`.e${target}`).style.pointerEvents = "none";
		} else {
			document.querySelector(`.m${target}`).style.backgroundColor = "red";
			document.querySelector(`.m${target}`).style.pointerEvents = "none";
		}
	};

	const handleMiss = (target, shooterName) => {
		if (shooterName === username) {
			document.querySelector(`.e${target}`).style.backgroundColor = "green";
			document.querySelector(`.e${target}`).style.pointerEvents = "none";
		} else {
			document.querySelector(`.m${target}`).style.backgroundColor = "green";
			document.querySelector(`.m${target}`).style.pointerEvents = "none";
		}
	};

	const playerLeftGame = (boolean) => {
		setLeftGame(boolean);
	};

	useEffect(() => {
		socket.on("player:disconnected", playerLeftGame);

		socket.on("player:hit", handleHit);
		socket.on("player:miss", handleMiss);
	}, [socket, user, opponent, username]);

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
					<div className="yourBoard">{myDivBoxes}</div>
					<p>{username}</p>
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
