import './App.scss';
import socketio from 'socket.io-client';
import { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import GameBoard from './components/GameBoard';

const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL);

function App() {
	const [username, setUsername] = useState('');
	const [userInput, setUserInput] = useState('');
	const [opponentName, setOpponentName] = useState('');
	const [fullGame, setFullGame] = useState(false);

	const handleUsernameSubmit = (e) => {
		e.preventDefault();
		setUsername(userInput);
		socket.emit('player:username', userInput);
		setUserInput('');
		socket.emit('user:joined', username);
	};

	useEffect(() => {
		socket.on('username', function (username) {
			setOpponentName(username);
		});

		socket.on('game:full', (boolean, playersArray) => {
			setFullGame(boolean);
			setUsername(playersArray.length);
		});
	}, [username]);

	return (
		<div className='App'>
			{/* when username is entered in landing page, game board will show */}
			{username ? (
				<GameBoard
					socket={socket}
					username={username}
					opponentName={opponentName}
				/>
			) : (
				<LandingPage
					onHandleUsernameSubmit={handleUsernameSubmit}
					userInput={userInput}
					setUserInput={setUserInput}
				/>
			)}

			{fullGame && username === 0 && (
				<div>
					<h1>SORRY GAME FULL</h1>
					<p>try again later</p>
				</div>
			)}
		</div>
	);
}

export default App;
