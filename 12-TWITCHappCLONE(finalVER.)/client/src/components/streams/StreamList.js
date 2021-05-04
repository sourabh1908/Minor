import React from 'react';
import { connect  } from 'react-redux';
import { fetchStreams } from '../../actions';
import { Link } from 'react-router-dom';


class StreamList extends React.Component {
    componentDidMount() {
        this.props.fetchStreams();
    }

    renderAdmin(stream){
      if(stream.userId === this.props.currentUSerId){
          return (
              <div className='right floated content'>
                  <Link to={`/streams/edit/${stream.id}`} className='ui button primary'>Edit</Link>
                  <Link to={`streams/${stream.id}/delete`}className='ui button negative'>Delete</Link>
              </div>
          )
      }
    }

    renderList() {
        return this.props.streams.map( stream => {
            return(
                <div className='item' key={stream.id}>
                         <div>{this.renderAdmin(stream)}</div>
                        <i className='large middle aligned icon camera' />
                        <div className='content'>
                           <Link to={`streams/${stream.id}`}>
                           {stream.title}
                            <div className='description'>{stream.description}</div>
                           </Link>
                        </div>
                </div>
            )
        })
    }

    renderCreate(){
        if(this.props.isSignedIn){
            return (
                <div style={ {textAlign: 'right'} }>
                   <Link to='/streams/new' className='ui button primary'>Create Stream</Link> 
                </div>
            )
        }
    }

    render() {
        return(
            <div>
                <h2>Streams</h2>
                <div className='ui celled list'>
                   {this.renderList()}
                   {this.renderCreate()}
               </div>
            </div>
        );
      };

 
};

const mapStateToProps = state => {
    return { streams: Object.values(state.streams),//change the value of object into array
             currentUSerId: state.auth.userId,//this is id of user which is currently signed in
             isSignedIn: state.auth.isSignedIn
            };
};

export default connect(mapStateToProps, { fetchStreams })(StreamList);