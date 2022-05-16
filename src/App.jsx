import './App.scss'
import socketio from 'socket.io-client'
import { useEffect, useState } from 'react'

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
			<div className='landing-page'>
				<h1>BATTLESHIPS</h1>

				<form onSubmit={handleUsernameSubmit}>
					<div className='form-group'>
						<input
							type='text'
							id='username'
							required
							placeholder='Enter username...'
							value={userInput}
							onChange={e => setUserInput(e.target.value)}
						/>
						<button type='submit' className='btn'>
							Start Game
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default App
