import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../types";

const MainPage: React.FC = () => {
	const greeting = useSelector((state: RootState) => state.greeting.message);

	return (
		<div>
			<h1>{greeting}</h1>
		</div>
	);
};

export default MainPage;
