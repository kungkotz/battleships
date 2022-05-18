import { useEffect, useState } from 'react';

const GameBoard = ({ socket, username, opponentName }) => {
	const [leftGame, setLeftGame] = useState(false);
	// Handle battle board and ships then start game

	// Handle hit and miss

	useEffect(() => {
		socket.on('player:disconnected', function (boolean) {
			setLeftGame(boolean);
		});
	}, [socket]);

	return (
		<div>
			<h2>Let's play some Battleship!</h2>

			<p>{username} here</p>
			<p> {opponentName} somewhere</p>

			{/* Lets player know if opponent left game */}
			{leftGame === true && <h1>{opponentName} left the game</h1>}
		</div>
	);
};

export default GameBoard;
