import { GreetingState } from "../types";

// Action Types
const SET_GREETING = "greeting/SET_GREETING";

// Action Creators
export const setGreeting = (greeting: string) => ({
	type: SET_GREETING,
	payload: greeting,
});

type GreetingAction = ReturnType<typeof setGreeting>;

// Initial State
const initialState: GreetingState = {
	message: "안녕하세요",
};

// Reducer
export default function reducer(state = initialState, action: GreetingAction): GreetingState {
	switch (action.type) {
		case SET_GREETING:
			return { ...state, message: action.payload };
		default:
			return state;
	}
}
