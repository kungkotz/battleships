import './App.css'
import socketio from 'socket.io-client'

const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL)

function App() {
	console.log(socket)

	return (
		<div className='App'>
			<h1>BATTLESHIPS BY GAR</h1>
		</div>
	)
}

export default App
