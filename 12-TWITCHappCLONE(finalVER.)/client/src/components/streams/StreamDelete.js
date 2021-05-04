import React from 'react';
import Modal from '../Modal';
import history from '../../history';
import { connect } from 'react-redux';
import { fetchStream, deleteStream } from '../../actions';
import { Link } from 'react-router-dom';


class StreamDelete extends React.Component {
    componentDidMount() {
       this.props.fetchStream(this.props.match.params.id);
    }


    renderActions() {
              const idToDelete = this.props.match.params.id;
                return (//React.fragment help us to do work without using separate 'div'
                      //we used the arrow function in Delete button because we dont want to call thr acti0on create rigth afet we loadd the delete page
                <React.Fragment>
                    <button onClick={() => this.props.deleteStream(idToDelete)} className='ui button negative'>Delete</button>
                    <Link to='/' className='ui button'>Cancel</Link>
                </React.Fragment>
                )
     };

     renderContent() {
         if(!this.props.stream){
             return (
                <div className="ui active inverted dimmer">
                   <div className="ui text loader">Loading</div>
               </div>  
             );
         }
             return `Are you Sure you want to delete this stream with title: ${this.props.stream.title}`
     }

    render(){
        return (
            <div>
                <Modal 
                      title="Delete Stream" 
                      content= {this.renderContent()}
                      actions={this.renderActions()}
                      onDismiss={() => history.push('/')}
                />
            </div>
        );
    }
}

//to get information from redux store
const mapStateToProps = (state, ownProps) => {//we used 'ownProps' becauuse to look at the 'match.props's ID and get that info.
return { stream: state.streams[ownProps.match.params.id]};
}

export default connect(mapStateToProps, { fetchStream, deleteStream })(StreamDelete);