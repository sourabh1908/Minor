import { combineReducers } from 'redux';
import authReducers from './authReducer';
import { reducer as formReducer } from 'redux-form';
import streamReducer from './streamReducer';


export default combineReducers({
    auth: authReducers,
    form: formReducer,
    streams: streamReducer
});