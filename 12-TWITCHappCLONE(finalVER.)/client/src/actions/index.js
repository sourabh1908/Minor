import streams from '../apis/streams';
import history from '../history';

export const signIn = (userId) => {
    return {
        type: 'SIGN_IN',
        payload: userId
    };
};

export const signOut = () => {
    return {
        type: 'SIGN_OUT'
    };
};

//below actions are using redux-thunk 
export const createStream = formValues => async (dispatch, getState) => {//create a stream//'getState' Fn help us to reach the redux store and get what we want
    const { userId } = getState().auth;
    const response  = await  streams.post('/streams', { ...formValues, userId });

    dispatch({ type: 'CREATE_STREAM', payload: response.data })
    history.push('/');//navigate to home page this page after form submisson automatically
};

//get list of STREAM
export const fetchStreams = () => async dispatch => {
    const response  = await  streams.get('/streams');

    dispatch({ type: 'FETCH_STREAMS', payload: response.data })
};

//get a SINGLE STREAM
export const fetchStream = id => async dispatch => {
    const response  = await  streams.get(`/streams/${id}`);

    dispatch({ type: 'FETCH_STREAM', payload: response.data })
};

//edit a STREAM
export const editStream = (id, formValues) => async dispatch => {
    const response  = await  streams.patch(`/streams/${id}`, formValues);//we've user 'PATCH' in place of 'put' becuse it will change only selected properties of our database while 'PUT' requwst  wasn't

    dispatch({ type: 'EDIT_STREAM', payload: response.data });
    history.push('/');//navigate to home page this page after form submisson automatically
};

//delete a STREAM
export const deleteStream = id => async dispatch => {
    await  streams.delete(`/streams/${id}`);

    dispatch({ type: 'DELETE_STREAM', payload: id })
    history.push('/');//navigate to home page this page after form submisson automatically
};


