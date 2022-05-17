const GameBoard = ({ socket, username, opponentName }) => {
	console.log(socket);

	// Handle battle board and ships then start game

	// Handle hit and miss

	return (
		<div>
			<h2>Let's play some Battleship!</h2>

			<p>{username} here</p>
			<p> {opponentName} somewhere</p>
		</div>
	);
};

export default GameBoard;
