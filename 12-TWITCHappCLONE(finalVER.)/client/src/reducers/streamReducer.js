import _ from 'lodash';
// eslint-disable-next-line
export default (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_STREAMS': 
             return { ...state, ..._.mapKeys(action.payload, 'id') };
        case 'FETCH_STREAM':
            return { ...state, [action.payload.id]: action.payload};
        case 'CREATE_STREAM':
            return { ...state, [action.payload.id]: action.payload};
        case 'EDIT_STREAM':
            return { ...state, [action.payload.id]: action.payload};
        case 'DELETE_STREAM':
            return _.omit(state, action.payload);  //it  automativally create a new object  
                  
    default: 
        return state;
    };
};