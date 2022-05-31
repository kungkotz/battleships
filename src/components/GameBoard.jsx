import "../styles/GameBoard.scss";
import { useState, useEffect, useCallback } from "react";
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

	const [myTurn, setMyTurn] = useState();

	/* Generates your ships */
	const generateYourShips = (squares, extra) => {
		let ship = [];
		let randomPosition;

		if (squares === 4) {
			let yPosition = Math.floor(Math.random() * 7) + 1;
			let xPosition = Math.floor(Math.random() * 7);
			randomPosition = "" + yPosition + xPosition;
		}

		if (squares === 3) {
			let yPosition = Math.floor(Math.random() * 8) + 1;
			let xPosition = Math.floor(Math.random() * 8);
			randomPosition = "" + yPosition + xPosition;
		}

		if (squares === 2) {
			let yPosition = Math.floor(Math.random() * 9) + 1;
			let xPosition = Math.floor(Math.random() * 9);
			randomPosition = "" + yPosition + xPosition;
		}

		let startPosition = "y" + randomPosition;

		ship.push(startPosition);

		for (let i = 0; i < squares - 1; i++) {
			ship.push("y" + ++randomPosition);
		}

		if (tehShips.some((item) => ship.includes(item))) {
			ship = [];
			generateYourShips(squares, extra);
		}

		if (ship.length === 4 && extra === "single") {
			tehShips.push(...ship);
			return setBattleship((battleship) => [...battleship, ...ship]);
		}

		if (ship.length === 3 && extra === "single") {
			tehShips.push(...ship);
			return setCruiser((cruiser) => [...cruiser, ...ship]);
		}

		if (ship.length === 2 && extra === "single") {
			tehShips.push(...ship);
			return setSubmarine1((submarine1) => [...submarine1, ...ship]);
		}

		if (ship.length === 2 && extra === "double") {
			tehShips.push(...ship);
			return setSubmarine2((submarine2) => [...submarine2, ...ship]);
		}
	};

	/* Generates grid */
	const generateYourDivs = () => {
		const yourDivBoxes = [];
		for (let i = 0; i < 100; i++) {
			yourDivBoxes.push(<div className={`y${i}`} key={`${i}`}></div>);
		}
		return setYourDivs((yourDivs) => [...yourDivs, ...yourDivBoxes]);
	};

	/* Generates enemy div */
	const generateEnemyDivs = () => {
		const enemyDivBoxes = [];
		for (let i = 0; i < 100; i++) {
			enemyDivBoxes.push(<div className={`e${i}`} key={`${i}`}></div>);
		}
		return setEnemyDivs((enemyDivs) => [...enemyDivs, ...enemyDivBoxes]);
	};

	// handles click
	const clickOnGrid = (e) => {
		if (myTurn) {
			socket.emit("player:shot-fired", e.target.className);

			setMyTurn(false);
		}
	};

	const removePart = (array, hit) => {
		let index = array.indexOf(hit);
		array.splice(index, 1);
		return;
	};

	// Handling if the shot was a hit or miss on the opponent board
	const handleShotFired = useCallback(
		(id) => {
			const target = id.replace("e", "y");
			const hitBattleship = battleship.includes(target);
			const hitCruiser = cruiser.includes(target);
			const hitSubmarine1 = submarine1.includes(target);
			const hitSubmarine2 = submarine2.includes(target);

			if (hitBattleship) {
				document.querySelector(`.${target}`).innerHTML = "💥";
				document.querySelector(`.${target}`).style.pointerEvents = "none";

				socket.emit("player:shot-reply", target, true);

				removePart(battleship, target);

				if (battleship.length === 0) {
					setYourShips((prevState) => prevState - 1);

					socket.emit("player:ship-sunken", 1);
				}
			} else if (hitCruiser) {
				document.querySelector(`.${target}`).innerHTML = "💥";
				document.querySelector(`.${target}`).style.pointerEvents = "none";

				socket.emit("player:shot-reply", target, true);

				removePart(cruiser, target);

				if (cruiser.length === 0) {
					setYourShips((prevState) => prevState - 1);

					socket.emit("player:ship-sunken", 1);
				}
			} else if (hitSubmarine1) {
				document.querySelector(`.${target}`).innerHTML = "💥";
				document.querySelector(`.${target}`).style.pointerEvents = "none";

				socket.emit("player:shot-reply", target, true);

				removePart(submarine1, target);

				if (submarine1.length === 0) {
					setYourShips((prevState) => prevState - 1);

					socket.emit("player:ship-sunken", 1);
				}
			} else if (hitSubmarine2) {
				document.querySelector(`.${target}`).innerHTML = "💥";
				document.querySelector(`.${target}`).style.pointerEvents = "none";

				socket.emit("player:shot-reply", target, true);

				removePart(submarine2, target);

				if (submarine2.length === 0) {
					setYourShips((prevState) => prevState - 1);

					socket.emit("player:ship-sunken", 1);
				}
			} else {
				document.querySelector(`.${target}`).innerHTML = "❌";
				document.querySelector(`.${target}`).style.pointerEvents = "none";

				socket.emit("player:shot-reply", target, false);
			}

			setMyTurn(true);
		},
		[battleship, cruiser, socket, submarine1, submarine2]
	);

	// Handling if the shot was a hit or miss on the your board
	const handleShotReceived = (id, boolean) => {
		const target = id.replace("y", "e");

		if (boolean === false) {
			document.querySelector(`.${target}`).innerHTML = "❌";
			document.querySelector(`.${target}`).style.pointerEvents = "none";
		} else {
			document.querySelector(`.${target}`).innerHTML = "💥";
			document.querySelector(`.${target}`).style.pointerEvents = "none";
		}
	};

	// Handling when ship has been detroyed
	const handleSunkenShip = (id) => {
		setEnemyShips((prevState) => prevState - id);
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
		const showShips = () => {
			const allShips = battleship.concat(cruiser, submarine1, submarine2);

			for (let i = 0; i < allShips.length; i++) {
				let myBoatCoord = allShips[i];
				document.querySelector(`.${myBoatCoord}`).style.backgroundColor =
					"#562503";
			}
		};

		showShips();
	}, [battleship, cruiser, submarine1, submarine2]);

	useEffect(() => {
		socket.on("player:disconnected", playerLeftGame);

		socket.on("player:fire", handleShotFired);

		socket.on("player:shot-received", handleShotReceived);

		socket.on("player:ship-sunken-reply", handleSunkenShip);

		return () => {
			socket.off("player:disconnected", playerLeftGame);

			socket.off("player:fire", handleShotFired);

			socket.off("player:shot-received", handleShotReceived);

			socket.off("player:ship-sunken-reply", handleSunkenShip);
		};
	}, [handleShotFired, socket]);

	useEffect(() => {
		setMyTurn(user.turn);
	}, [user]);
	return (
		<div className="container">
			<header>
				<h1>BATTLESHIP</h1>

				{!user && !opponent && (
					<dialog open className="nes-dialog is-rounded waiting">
						<p>Weigh Anchor and Hoist the Mizzen!</p>
						<p>Waiting for another player...</p>
					</dialog>
				)}

				{myTurn ? (
					<div>
						<p>Blow The Man Down!</p>
						<p>Your turn</p>
					</div>
				) : (
					<div>
						<p>Wait Ye Seadog!</p>
						<p>Enemy turn</p>
					</div>
				)}

				{/* Lets player know if opponent left game */}
				{leftGame === true && (
					<dialog open className="nes-dialog is-rounded">
						<h2>{opponent.username} Brought a Spring Upon ‘er!</h2>
						<p>{opponent.username} left the game.</p>
						<button
							onClick={() => window.location.reload()}
							className="btn nes-btn is-error"
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

					<div className="yourBoard battleboard">{yourDivs}</div>
				</section>
				<section>
					{user && opponent && (
						<div className="player-container">
							<img src={pirateTwo} alt="pirate" className="avatar" />
							<h3>{opponent.username}</h3>
							<p>Ships left: {enemyShips}</p>
						</div>
					)}

					<div className="enemyBoard battleboard" onClick={clickOnGrid}>
						{enemyDivs}
					</div>
				</section>
			</main>

			{yourShips === 0 && (
				<dialog open className="nes-dialog is-rounded game-over-dialog">
					<h2>All Hands Hoy!</h2>
					<p>Time to walk the plank...</p>
					<button
						onClick={() => window.location.reload()}
						className="btn nes-btn is-error"
					>
						Exit
					</button>
				</dialog>
			)}

			{enemyShips === 0 && (
				<dialog open className="nes-dialog is-rounded game-over-dialog">
					<h2>Shiver Me Timbers!</h2>
					<p>We have booty to claim.</p>
					<p></p>
					<button
						onClick={() => window.location.reload()}
						className="btn nes-btn is-error"
					>
						Exit
					</button>
				</dialog>
			)}
		</div>
	);
};

export default GameBoard;
