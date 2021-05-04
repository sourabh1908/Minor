import React from 'react';
import ReactDOM from 'react-dom';


const Modal = props => {//we use 'stopPropogation()' to stop event bubbling
  return ReactDOM.createPortal(//for using Portal
    <div onClick={ props.onDismiss }  className="ui dimmer modals visible active">
      <div onClick={ (e) => e.stopPropagation() }   className="ui standard modal visible active">
        <div className='header'> {props.title}</div>
        <div className='content'>
            {props.content}
        </div>    
        <div className='actions'>
            {props.actions}
        </div>      
      </div>
    </div>,
    document.querySelector('#modal')//rather then as a child of something it will directly appear in the body of index.js
  );
};

export default Modal;
//React v16 introduced a new feature called portals. 
//The documentation states that: Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.
// Normally, a functional or a class component renders a tree of React elements (usually generated from JSX).
