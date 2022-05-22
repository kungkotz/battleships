import "./App.scss";
import socketio from "socket.io-client";
import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import GameBoard from "./components/GameBoard";

const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL);

function App() {
	const [username, setUsername] = useState("");
	const [userInput, setUserInput] = useState("");

	const [user, setUser] = useState("");
	const [opponent, setOpponent] = useState("");
	const [fullGame, setFullGame] = useState(false);

	// Handles username when player submits
	const handleUsernameSubmit = (e) => {
		e.preventDefault();
		setUsername(userInput);
		socket.emit("player:joined", userInput);
		setUserInput("");
	};
	console.log("username", username);

	useEffect(() => {
		socket.on("players:profiles", function (players) {
			if (players.length === 2) {
				const thisSocket = players.find((player) => player.id === socket.id);
				thisSocket.currentPlayer = "user";
				const otherSocket = players.find((player) => player.id !== socket.id);
				otherSocket.currentPlayer = "enemy";

				setUser(thisSocket);
				setOpponent(otherSocket);
			}
		});

		socket.on("game:full", (boolean, playersArray) => {
			setFullGame(boolean);
			setUsername(playersArray.length);
		});
	}, [opponent, user, username]);

	return (
		<div className="App">
			{/* when username is entered in landing page, game board will show */}
			{username ? (
				<GameBoard
					socket={socket}
					user={user}
					opponent={opponent}
					username={username}
				/>
			) : (
				<LandingPage
					onHandleUsernameSubmit={handleUsernameSubmit}
					userInput={userInput}
					setUserInput={setUserInput}
				/>
			)}

			{/* If there is an ongoing game this will show */}
			{fullGame && username === 0 && (
				<div className="alert">
					<h2>Avast ye! Ongoing battle...</h2>
					<p className="muted">try again later</p>
				</div>
			)}
		</div>
	);
}

export default App;
