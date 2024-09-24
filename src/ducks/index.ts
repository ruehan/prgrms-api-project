import { combineReducers } from "redux";
import greetingReducer from "./greeting";

const rootReducer = combineReducers({
	greeting: greetingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
