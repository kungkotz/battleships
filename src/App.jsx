import "./App.scss";
import socketio from "socket.io-client";
import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import GameBoard from "./components/GameBoard";
import themeSong from "./assets/theme-song.mp3";

const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL);

function App() {
	const [username, setUsername] = useState("");
	const [userInput, setUserInput] = useState("");

	const [user, setUser] = useState("");
	const [opponent, setOpponent] = useState("");

	const [isMuted, setIsMuted] = useState(false);

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

	useEffect(() => {}, []);

	return (
		<div className="App">
			<div className="audio-player">
				<audio controls={false} autoPlay={true} muted={isMuted} loop>
					<source src={themeSong} typeof="audio/mp3" />
				</audio>

				<button
					className={!isMuted ? "nes-btn is-error" : "nes-btn is-success"}
					onClick={() => setIsMuted(!isMuted)}
				>
					{!isMuted ? "Mute" : "Unmute"}
				</button>
			</div>
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
