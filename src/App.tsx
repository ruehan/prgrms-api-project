import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import MainPage from "./components/MainPage";

const App: React.FC = () => {
	return (
		<Provider store={store}>
			<MainPage />
		</Provider>
	);
};

export default App;
