import "../styles/GameBoard.scss";
import { useState, useEffect } from "react";
import pirateOne from "../assets/p1.png";
import pirateTwo from "../assets/p2.png";

const GameBoard = ({ socket, user, opponent }) => {
	const [leftGame, setLeftGame] = useState(false);

	const [yourDivs, setYourDivs] = useState([]);
	const [enemyDivs, setEnemyDivs] = useState([]);

	const [yourShips, setYourShips] = useState(4);
	const [enemyShips, setEnemyShips] = useState(4);

	const tehShips = [];

	const [battleship, setBattleship] = useState([]);
	const [cruiser, setCruiser] = useState([]);
	const [submarine1, setSubmarine1] = useState([]);
	const [submarine2, setSubmarine2] = useState([]);

	const [myTurn, setMyTurn] = useState(true);

	/* Generates your ships */
	const generateYourShips = (squares, extra) => {
		let ship = [];
		let randomPosition;

		if (squares === 4) {
			let yPosition = Math.floor(Math.random() * 7) + 1;
			let xPosition = Math.floor(Math.random() * 7);
			randomPosition = "" + yPosition + xPosition;
			// console.log("y: ", yPosition + " x: ", xPosition);
		}

		if (squares === 3) {
			let yPosition = Math.floor(Math.random() * 8) + 1;
			let xPosition = Math.floor(Math.random() * 8);
			randomPosition = "" + yPosition + xPosition;
			// console.log("y: ", yPosition + " x: ", xPosition);
		}

		if (squares === 2) {
			let yPosition = Math.floor(Math.random() * 9) + 1;
			let xPosition = Math.floor(Math.random() * 9);
			randomPosition = "" + yPosition + xPosition;
			// console.log("y: ", yPosition + " x: ", xPosition);
		}

		let startPosition = "y" + randomPosition;

		// console.log("här startar vi: ", randomPosition);
		// console.log("innan push ", startPosition);

		ship.push(startPosition);

		for (let i = 0; i < squares - 1; i++) {
			ship.push("y" + ++randomPosition);
		}

		// console.log("teHShIpS", tehShips);
		// console.log("yourShips: ", yourShips);

		// let double = tehShips.some((item) => ship.includes(item));

		// console.log(double);

		if (tehShips.some((item) => ship.includes(item))) {
			ship = [];
			generateYourShips(squares, extra);
		}

		if (ship.length === 4 && extra === "single") {
			// console.log("battleship är pushad");
			tehShips.push(...ship);
			// setYourShips((yourShips) => [...yourShips, ...ship]);
			return setBattleship((battleship) => [...battleship, ...ship]);
		}

		if (ship.length === 3 && extra === "single") {
			// console.log("cruiser är pushad");
			tehShips.push(...ship);
			// setYourShips((yourShips) => [...yourShips, ...ship]);
			return setCruiser((cruiser) => [...cruiser, ...ship]);
		}

		if (ship.length === 2 && extra === "single") {
			// console.log("ubåt1 är pushad");
			tehShips.push(...ship);
			// setYourShips((yourShips) => [...yourShips, ...ship]);
			return setSubmarine1((submarine1) => [...submarine1, ...ship]);
		}

		if (ship.length === 2 && extra === "double") {
			// console.log("ubåt2 är pushad");
			tehShips.push(...ship);
			// setYourShips((yourShips) => [...yourShips, ...ship]);
			return setSubmarine2((submarine2) => [...submarine2, ...ship]);
		}
	};

	console.log("Battleship", battleship);
	console.log("Cruiser", cruiser);
	console.log("Submarine1", submarine1);
	console.log("Submarine2", submarine2);

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

	const showShips = () => {
		const allShips = battleship.concat(cruiser, submarine1, submarine2);
		console.log("All my ships are : ", allShips);

		for (let i = 0; i < allShips.length; i++) {
			let myBoatCoord = allShips[i];
			document.querySelector(`.${myBoatCoord}`).style.backgroundColor = "black";
		}
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

	// handles click
	const clickOnGrid = (e) => {
		if (myTurn) {
			// console.log(e.target.className);

			socket.emit("player:shot-fired", e.target.className);

			// setMyTurn(!myTurn);
		}
	};

	const removePart = (array, hit) => {
		let index = array.indexOf(hit);
		array.splice(index, 1);
		return;
	};

	// Handling if the shot was a hit or miss on the opponent board
	const handleShotFired = (id) => {
		const target = id.replace("e", "y");
		const hitBattleship = battleship.includes(target);
		const hitCruiser = cruiser.includes(target);
		const hitSubmarine1 = submarine1.includes(target);
		const hitSubmarine2 = submarine2.includes(target);

		if (hitBattleship) {
			console.log(`You shot at ${target} and it's a HIT!`);

			document.querySelector(`.${target}`).style.backgroundColor = "green";
			document.querySelector(`.${target}`).style.pointerEvents = "none";

			socket.emit("player:shot-reply", target, true);

			removePart(battleship, target);

			if (battleship.length === 0) {
				console.log("Battleship dead");
				setYourShips((prevState) => prevState - 1);
				console.log("How many ships left?", yourShips);
				socket.emit("player:ship-sunken", 1);
			}
		}

		if (hitCruiser) {
			console.log(`You shot at ${target} and it's a HIT!`);

			document.querySelector(`.${target}`).style.backgroundColor = "green";
			document.querySelector(`.${target}`).style.pointerEvents = "none";

			socket.emit("player:shot-reply", target, true);

			removePart(cruiser, target);

			if (cruiser.length === 0) {
				console.log("Battleship dead");
				setYourShips((prevState) => prevState - 1);
				console.log("How many ships left?", yourShips);
				socket.emit("player:ship-sunken", 1);
			}
		}

		if (hitSubmarine1) {
			console.log(`You shot at ${target} and it's a HIT!`);

			document.querySelector(`.${target}`).style.backgroundColor = "green";
			document.querySelector(`.${target}`).style.pointerEvents = "none";

			socket.emit("player:shot-reply", target, true);

			removePart(submarine1, target);

			if (submarine1.length === 0) {
				console.log("Battleship dead");
				setYourShips((prevState) => prevState - 1);
				console.log("How many ships left?", yourShips);
				socket.emit("player:ship-sunken", 1);
			}
		}

		if (hitSubmarine2) {
			console.log(`You shot at ${target} and it's a HIT!`);

			document.querySelector(`.${target}`).style.backgroundColor = "green";
			document.querySelector(`.${target}`).style.pointerEvents = "none";

			socket.emit("player:shot-reply", target, true);

			removePart(submarine2, target);

			if (submarine2.length === 0) {
				console.log("Battleship dead");
				setYourShips((prevState) => prevState - 1);
				console.log("How many ships left?", yourShips);
				socket.emit("player:ship-sunken", 1);
			}
		}

		// else {
		// 	console.log(`You shot at ${target} and it's a MISS!`);

		// 	document.querySelector(`.${target}`).style.backgroundColor = "red";
		// 	document.querySelector(`.${target}`).style.pointerEvents = "none";

		// 	socket.emit("player:shot-reply", target, false);
		// }

		// setMyTurn(myTurn);
	};

	// Handling if the shot was a hit or miss on the your board
	const handleShotReceived = (id, boolean, ship) => {
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
		generateYourShips(4, "single");
		generateYourShips(3, "single");
		generateYourShips(2, "single");
		generateYourShips(2, "double");

		generateYourDivs();
		generateEnemyDivs();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		showShips();
	}, [showShips]);

	useEffect(() => {
		console.log("Total ships", yourShips);
		console.log("USER", user);
		console.log("OPPONENT", opponent);

		// console.log("myTurn?", myTurn);

		// console.log("THIS MY SHIPS ARRAY", yourShips);

		socket.on("player:disconnected", playerLeftGame);

		socket.on("player:fire", handleShotFired);

		socket.on("player:shot-received", handleShotReceived);

		socket.on("player:ship-sunken-reply", (id) => {
			setEnemyShips((prevState) => prevState - id);
		});
	}, [socket, user, opponent, yourShips, enemyShips]);

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
						<button
							onClick={() => window.location.reload()}
							className="btn btn-exit"
						>
							Exit
						</button>
					</dialog>
				)}
			</header>
			<main>
				<section>
					{user && opponent && (
						<div className="player-container">
							<img src={pirateOne} alt="pirate" className="avatar" />
							<h3>{user.username}</h3>
							<p>Ships left: {yourShips}</p>
						</div>
					)}

					<div className="yourBoard">{yourDivs}</div>
				</section>
				<section>
					{user && opponent && (
						<div className="player-container">
							<img src={pirateTwo} alt="pirate" className="avatar" />
							<h3>{opponent.username}</h3>
							<p>Ships left: {enemyShips}</p>
						</div>
					)}

					<div className="enemyBoard" onClick={clickOnGrid}>
						{enemyDivs}
					</div>
				</section>
			</main>

			{yourShips === 0 && (
				<dialog>
					<h2>Game Over</h2>
					<button
						onClick={() => window.location.reload()}
						className="btn btn-exit"
					>
						Exit
					</button>
				</dialog>
			)}
		</div>
	);
};

export default GameBoard;
