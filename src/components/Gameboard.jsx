import "../styles/Gameboard.scss";
import { useState, useEffect } from "react"

const Gameboard = ({ socket }) => {
	const [guess, setGuess] = useState(0)
	const [gameStatus, setGameStatus] = useState(true)
	const yourDivBoxes = []
	const enemyDivBoxes = [];
	const yourShips = ['y0', 'y1', 'y2', 'y3']
	const enemyShips = [];

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

		if (yourShips.includes(e.target.className)) {
			postBoxClick(e.target.className, true)
		}

		if (!yourShips.includes(e.target.className)) {
			postBoxClick(e.target.className, false)
		}
	}

	for (let i = 0; i < 100; i++) {
		yourDivBoxes.push(<div className={`y${i}`} onClick={clickOnGrid} key={`${i}`}></div >)
	}

	return (
		<div>
			<h2>Let's play some Battleship!</h2>
			<main>
				<section>
					<p>Your guesses: {guess}</p>
					<div className="yourBoard">
						{yourDivBoxes}
					</div>
				</section>
				<section></section>
			</main>
		</div>
	)
}

export default Gameboard
