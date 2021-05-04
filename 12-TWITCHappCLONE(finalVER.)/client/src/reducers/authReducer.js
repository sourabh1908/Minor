const INTIAL_STATE = {
    isSignedIn:  null,
    userId: null
};

// eslint-disable-next-line
export default (state = INTIAL_STATE, action) => {//when reducers get first called the initial state will set to be NULL 
      switch (action.type){
          case 'SIGN_IN':
              return { ...state, isSignedIn: true, userId: action.payload };
          case 'SIGN_OUT':
              return { ...state, isSignedIn: false, userId: null };
          default:
              return state;
      }
};