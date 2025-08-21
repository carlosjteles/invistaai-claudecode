import { combineReducers, configureStore } from "@reduxjs/toolkit";
import ui from "./ui";
import contact from "./contact";

const reducer = combineReducers({ ui, contact });

const store = configureStore({
	reducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export { store };
