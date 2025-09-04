import { SEND_EMAIL_POST } from "../api";
import createAsyncSlice from "./helper/createAsyncSlice";

const slice = createAsyncSlice({
	name: "contact",
	fetchConfig: (data) => SEND_EMAIL_POST(data),
});

export const sendEmail = slice.asyncAction;

export default slice.reducer;
