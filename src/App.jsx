import './App.scss'
import socketio from 'socket.io-client'

const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL)

function App() {
	console.log(socket)

	return (
		<div className='App'>
			<div className='landing-page'>
				<h1>BATTLESHIPS</h1>

				<form>
					<div className='form-group'>
						<input
							type='text'
							id='username'
							required
							placeholder='Enter username...'
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
