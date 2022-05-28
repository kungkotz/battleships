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

	// Handles username when player submits
	const handleUsernameSubmit = (e) => {
		e.preventDefault();
		setUsername(userInput);
		socket.emit("player:joined", userInput);
		setUserInput("");
	};

	useEffect(() => {
		socket.on("players:profiles", function (players) {
			if (players.length === 2) {
				const thisSocket = players.find((player) => player.id === socket.id);
				const otherSocket = players.find((player) => player.id !== socket.id);

				setUser(thisSocket);
				setOpponent(otherSocket);
			}
		});

		socket.on("game:full", (playersArray) => {
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
		</div>
	);
}

export default App;
