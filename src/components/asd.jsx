import "../styles/GameBoard.scss";
import { useState, useEffect } from "react"

const GameBoard = ({ socket, username, opponentName }) => {
	const [leftGame, setLeftGame] = useState(false);
	const [guess, setGuess] = useState(0)
	const [gameStatus, setGameStatus] = useState(true)
	const yourDivBoxes = []
	const enemyDivBoxes = [];
	const yourShips = ['y0', 'y1', 'y2', 'y3']
	const enemyShips = ['e1', 'e2', 'e3', 'e4'];

	// if (gameStatus === true) {
	// 	console.log('här försvinner div och spelet börjar')
	// }

	// if (gameStatus === false) {
	// 	console.log("div som täcker tills motståndare är ansluten")
	// }

	const postBoxClick = (id, clicked) => {
		if (clicked) {
			document.querySelector(`.${id}`).style.backgroundColor = "green"
			document.querySelector(`.${id}`).style.pointerEvents = "none"
		}

		if (!clicked) {
			document.querySelector(`.${id}`).style.backgroundColor = "red"
			document.querySelector(`.${id}`).style.pointerEvents = "none"
		}
	}

	const clickOnGrid = (e) => {
		setGuess(guess + 1)

		if (enemyShips.includes(e.target.className)) {
			postBoxClick(e.target.className, true)
		}

		if (!enemyShips.includes(e.target.className)) {
			postBoxClick(e.target.className, false)
		}
	}

	for (let i = 0; i < 100; i++) {
		yourDivBoxes.push(<div className={`y${i}`} key={`${i}`}></div >)
	}

	for (let i = 0; i < 100; i++) {
		enemyDivBoxes.push(<div className={`e${i}`} onClick={clickOnGrid} key={`${i}`}></div >)
	}

	// yourShips.forEach(e => {
	// 	console.log(e)
	// 	document.querySelector(`.${e}`).style.backgroundColor = 'blue'
	// })

	useEffect(() => {
		socket.on('player:disconnected', function (boolean) {
			setLeftGame(boolean);
		});
	}, [socket]);

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
					<p>Your guesses: {guess}</p>
					<div className="yourBoard">
						{yourDivBoxes}
					</div>
				</section>
				<section>
					<p>Enemy :P click on this board</p>
					<div className="enemyBoard">
						{enemyDivBoxes}
					</div>
				</section>
			</main>

		</div>
	)
}

export default GameBoard
