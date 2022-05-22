import "../styles/GameBoard.scss";
import { createBoard } from "../helpers/helpers";
import { useState, useEffect } from "react";

const GameBoard = ({ socket, user, opponent }) => {
	const [leftGame, setLeftGame] = useState(false);

	const myDivBoxes = [];
	const enemyDivBoxes = [];

	createBoard(myDivBoxes, "m");
	createBoard(enemyDivBoxes, "e");

	const clickOnGrid = (e) => {
		socket.emit("player:shot-fired", e.target.dataset.id);
		console.log(e.target.dataset.id);
	};

	const handleHit = (target) => {
		document.querySelector(`.m${target}`).style.backgroundColor = "red";
		document.querySelector(`.m${target}`).style.pointerEvents = "none";

		socket.emit("player:shot-reply", target, socket.id);
	};

	const handleMiss = (target) => {
		document.querySelector(`.m${target}`).style.backgroundColor = "black";
		document.querySelector(`.m${target}`).style.pointerEvents = "none";

		socket.emit("player:shot-reply", target, socket.id);
	};

	const playerLeftGame = (boolean) => {
		setLeftGame(boolean);
	};

	useEffect(() => {
		socket.on("player:disconnected", playerLeftGame);

		socket.on("player:hit", handleHit);

		socket.on("player:miss", handleMiss);
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
					<div className="yourBoard">{myDivBoxes}</div>
				</section>
				<section>
					<h3>Enemy board</h3>
					<div className="enemyBoard" onClick={clickOnGrid}>
						{enemyDivBoxes}
					</div>
				</section>
			</main>
		</div>
	);
};

export default GameBoard;
