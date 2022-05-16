import './App.scss'
import socketio from 'socket.io-client'
import { useEffect, useState } from 'react'
import LandingPage from './components/LandingPage'
import GameBoard from './components/GameBoard'

const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL)

function App() {
	// console.log(socket)

	const [username, setUsername] = useState('')
	const [userInput, setUserInput] = useState('')

	const handleUsernameSubmit = e => {
		e.preventDefault()
		setUsername(userInput)
		socket.emit('player:username', userInput)
		setUserInput('')
	}

	useEffect(() => {
		console.log(username)
	}, [username])

	return (
		<div className='App'>
			{/* when username is entered in landing page, game board will show */}
			{username ? (
				<GameBoard />
			) : (
				<LandingPage
					onHandleUsernameSubmit={handleUsernameSubmit}
					userInput={userInput}
					setUserInput={setUserInput}
				/>
			)}
		</div>
	)
}

export default App
