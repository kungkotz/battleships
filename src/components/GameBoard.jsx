import "../styles/GameBoard.scss";
import { useState, useEffect } from "react";

const GameBoard = ({ socket, user, opponent }) => {
	const [leftGame, setLeftGame] = useState(false);

	const [yourDivs, setYourDivs] = useState([]);
	const [enemyDivs, setEnemyDivs] = useState([]);

	const [battleship, setBattleship] = useState([]);
	const [cruiser, setCruiser] = useState([]);
	const [submarine, setSubmarine] = useState([]);

	const [myTurn, setMyTurn] = useState(true);

	/* Generates your ships */
	const generateYourShips = (squares) => {
		let ship = [];
		let randomPosition = Math.floor(Math.random() * 100);
		let startPosition = "y" + randomPosition;

		ship.push(startPosition);

		for (let i = 0; i < squares - 1; i++) {
			ship.push("y" + ++randomPosition);
		}

		// if (yourShips[ship]) {
		// 	generateYourShips();
		// }

		if (squares === 4) {
			return setBattleship((yourShips) => [...yourShips, ...ship]);
		}

		if (squares === 3) {
			return setCruiser((yourShips) => [...yourShips, ...ship]);
		}

		if (squares === 2) {
			return setSubmarine((yourShips) => [...yourShips, ...ship]);
		}
	};

	console.log("Battleship", battleship);
	console.log("Cruiser", cruiser);
	console.log("Submarine", submarine);

	/* Generates grid */
	const generateYourDivs = () => {
		const yourDivBoxes = [];
		for (let i = 0; i < 100; i++) {
			yourDivBoxes.push(
				<div className={`y${i}`} key={`${i}`}>
					{i}
				</div>
			);
		}
		return setYourDivs((yourDivs) => [...yourDivs, ...yourDivBoxes]);
	};

	/* Generates enemy div */

	const generateEnemyDivs = () => {
		const enemyDivBoxes = [];
		for (let i = 0; i < 100; i++) {
			enemyDivBoxes.push(
				<div className={`e${i}`} key={`${i}`}>
					{i}
				</div>
			);
		}
		return setEnemyDivs((enemyDivs) => [...enemyDivs, ...enemyDivBoxes]);
	};

	const clickOnGrid = (e) => {
		if (myTurn) {
			// console.log(e.target.className);

			socket.emit("player:shot-fired", e.target.className);

			setMyTurn(false);
		}
	};

	// Handling if the shot was a hit or miss on the opponent board
	const handleShotFired = (id) => {
		const target = id.replace("e", "y");
		const hitBattleship = battleship.includes(target);
		const hitCruiser = cruiser.includes(target);
		const hitSubmarine = submarine.includes(target);

		if (hitBattleship || hitCruiser || hitSubmarine) {
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

		setMyTurn(true);
	};

	// Handling if the shot was a hit or miss on the your board
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
	};

	// Handling disconnecting player
	const playerLeftGame = (boolean) => {
		setLeftGame(boolean);
	};

	useEffect(() => {
		generateYourShips(4);
		generateYourShips(3);
		generateYourShips(2);
		generateYourShips(2);

		generateYourDivs();
		generateEnemyDivs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// if (!user.myTurn === true) {
		// 	setMyTurn(true);
		// }

		console.log("myTurn?", myTurn);

		socket.on("player:disconnected", playerLeftGame);

		socket.on("player:fire", handleShotFired);

		socket.on("player:shot-received", handleShotReceived);
	}, [socket, user, opponent]);

	return (
		<div className="container">
			<header>
				<h2>Let's play some Battleship!</h2>

				{user && opponent ? (
					<p>
						<span>{user.username}</span> vs <span>{opponent.username}</span>
					</p>
				) : (
					<p>Waiting for another player...</p>
				)}

				{myTurn ? <p>Your turn</p> : <p>Enemy turn</p>}

				{/* Lets player know if opponent left game */}
				{leftGame === true && (
					<dialog open>
						<h2>{opponent.username} left the game</h2>
						<button onClick={() => window.location.reload()} className="btn">
							Exit
						</button>
					</dialog>
				)}
			</header>
			<main>
				<section>
					<h3>Your board</h3>

					<div className="yourBoard">{yourDivs}</div>
				</section>
				<section>
					<h3>Enemy board</h3>

					<div className="enemyBoard" onClick={clickOnGrid}>
						{enemyDivs}
					</div>
				</section>
			</main>
		</div>
	);
};

export default GameBoard;
