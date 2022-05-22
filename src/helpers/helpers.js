export const createBoard = (gridArray, userClass) => {
	for (let i = 0; i < 100; i++) {
		gridArray.push(
			<div className={`${userClass}${i}`} data-id={i} key={`${i}`}></div>
		);
	}
};
