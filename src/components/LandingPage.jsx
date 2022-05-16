const LandingPage = ({ onHandleUsernameSubmit, userInput, setUserInput }) => {
	return (
		<div className='landing-page'>
			<h1>BATTLESHIPS</h1>

			<form onSubmit={onHandleUsernameSubmit}>
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
	)
}

export default LandingPage
