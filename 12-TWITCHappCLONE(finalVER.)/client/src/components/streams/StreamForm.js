import React from 'react';
import { Field, reduxForm } from 'redux-form';//'reduxForm' is very similar in nature to the 'connect()'


class StreamForm extends React.Component {
    renderError({error, touched}) {
        if(touched && error){
            return (
                <div className='ui error message'>
                    <div className='header'>{error}</div>
                </div>
            );
        };
    };

renderInput = ({ input, label, meta }) => {
     return (
           <div className='field '>
               <label>{label}</label>
               <input {...input} autoComplete='off' />
               <div>{this.renderError(meta)}</div>
           </div>
        );//this will add all the 'onChange' and 'value' property to the Input tag 
    };
    
onSubmit = (formValues) =>{
    this.props.onSubmit(formValues);//this will create a stream using this action creator
}    

    render () {
        return (
                // 'handleSubmit' is predefine in the 'redux-form' which will alos run method like 'preventDefault()' when submited
                <form onSubmit={this.props.handleSubmit(this.onSubmit)}  className='ui form '>
                    {/* this the format of redux-from */}
                    <Field name='title' component={this.renderInput} label='Enter Title' />
                    <Field name='description' component={this.renderInput} label='Enter Description' />
                    <button className='ui button primary'>Submit </button>
                </form>
        );
    }
};

const validate = formValues => {
    const error = {};

     if(!formValues.title){
       error.title =  'You must enter a title'
     }

     if(!formValues.description){
        error.description =  'You must enter a description'
      }

   return error;   
};

export default reduxForm({
    form: 'StreamForm',//name of a form is generally the ppurpose of a form
    validate
})(StreamForm);



