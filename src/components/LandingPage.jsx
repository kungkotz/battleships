import ShipImg from "../assets/ship.png";

const LandingPage = ({ onHandleUsernameSubmit, userInput, setUserInput }) => {
	return (
		<div className="landing-page">
			<div className="container">
				<h1>BATTLESHIP</h1>

				<img src={ShipImg} alt="Battleship" className="shipImage" />
			</div>

			<form onSubmit={onHandleUsernameSubmit}>
				<div className="form-group">
					<input
						type="text"
						id="username"
						className="nes-input"
						required
						placeholder="Enter username..."
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
					/>
					<button type="submit" className="btn nes-btn">
						Start Game
					</button>
				</div>
			</form>
		</div>
	);
};

export default LandingPage;
