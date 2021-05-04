import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions'



class GoogleAuth extends React.Component {
    

    componentDidMount() {
        window.gapi.load('client:auth2', () => {//we used window because 'gapi' is present inside the window scope
            window.gapi.client.init({//this will give us objects which have innstruction to help us the user to sign in our website

                clientId : '1028089326207-k976bbgtvpsdv3ch2nf3filhg5lfcpds.apps.googleusercontent.com', 
                scope: 'email'
            }).then(() => {
                  this.auth = window.gapi.auth2.getAuthInstance();//it will give us current user status i.e. is user signed in or not then print status
                  this.onAuthChange(this.auth.isSignedIn.get());
                  this.auth.isSignedIn.listen(this.onAuthChange);  //this will show the current status of the user without refreshing the page    
             })
        });
    }

    onAuthChange = isSignedIn => {//this will also run when our appp first loads up
        if(isSignedIn){
            this.props.signIn(this.auth.currentUser.get().getId());//this argumetn will send the USer ID to the raspective action creater
        } else {
            this.props.signOut();
        }
    }

    onSignInClick = () => {
      this.auth.signIn();
    };
    onSignOutClick = () => {
     this.auth.signOut();
    };

    renderAuthButton() {
        if(this.props.isSignedIn === null){
            return null;
        } else if(this.props.isSignedIn) {
           return (
                <button onClick = { this.onSignOutClick } className='ui red google button'>
                    <i className='google icon' /> Sign Out! 
                </button>
             )
        } else {
            return (
                <button onClick={ this.onSignInClick } className='ui green google button'>
                <i className='google icon' /> Sign In with Google
                </button>
            )
        }
    }

    render() {
        return (
            <div>
                {this.renderAuthButton()}
            </div>
        );
    };
};

const mapStateToProps = (state) => {
    return { isSignedIn: state.auth.isSignedIn };
}


export default connect(mapStateToProps, {signIn, signOut })(GoogleAuth);