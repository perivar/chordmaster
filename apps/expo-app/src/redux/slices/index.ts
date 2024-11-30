import { combineReducers } from "@reduxjs/toolkit";

import auth from "./auth";
import config from "./config";
import library from "./library";

const rootReducer = combineReducers({
  auth,
  config,
  library,
});

export default rootReducer;
