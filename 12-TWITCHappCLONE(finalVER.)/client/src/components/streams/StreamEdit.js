import React from 'react';
import { connect } from "react-redux";
import { fetchStream, editStream } from '../../actions';
import StreamForm from './StreamForm';
import _ from 'lodash';

class StreamEdit extends React.Component {
    componentDidMount() {
        this.props.fetchStream(this.props.match.params.id);//it will find the proper stream which is to be EDIT
    }

   onSubmit  = formValues => {
       this.props.editStream(this.props.match.params.id, formValues);
   }

    render() {
        console.log(this.props);
            if(!this.props.stream) {
                return(
                    <div className="ui segment">
                        <div className="ui active inverted dimmer">
                            <div className="ui text loader">Loading</div>
                        </div>
                    </div>
                )
            }
            return (
                <div>
                   <h3>Edit</h3>
                   <StreamForm 
                          initialValues={_.pick(this.props.stream, 'title', 'description')} //we did this because we did not want to associate user id and id to stream while we make changes
                          onSubmit={this.onSubmit} //and '_.pick' will get us olny necessary properties
                    />
                </div>
            );
    }
};

const mapStateToProps = (state, ownProps) => {//we used 'ownProps' becauuse to look at the 'match.props's ID and get that info.
    return { stream: state.streams[ownProps.match.params.id]};
}

export default connect(mapStateToProps, { fetchStream, editStream })(StreamEdit);