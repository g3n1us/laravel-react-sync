import React, { Component } from 'react';
import ReactDOM from 'react-dom';

/** */
class Notification extends Component{

	/** */
  static get defaultProps(){
    return {
      level: 'success',
      text: null,
      visible: false,
    }
  }

	/** */
  constructor(props, defaultProps){
    super(props, defaultProps);
    this.state = {
      visible: this.props.visible,
      text: this.props.text,
      level: this.props.level,
    }
    this.tm = null;
  }

/*
  componentDidMount(){
    setTimeout(() => this.setState(this.constructor.defaultProps), 1500);

  }
*/
//UNSAFE_componentWillUpdate
/*
  componentDidUpdate(oldstate, newstate){
	  console.log(oldstate, newstate);
    let tm = setTimeout(() => {
      clearTimeout(tm);
      if(newstate.visible == true) this.setState(this.constructor.defaultProps)
    }, 1500);
  }
*/

	/** */
  hide(){
	  clearTimeout(this.tm);
    this.tm = setTimeout(() => {

      this.tm = null;
      this.setState(this.constructor.defaultProps);
    }, 1500);
  }

	/** */
  render(){
    if(!this.state.visible){
	    return null;
    }
    else{
	    this.hide();
	    return (
			<div className={`alert fade show alert-${this.state.level}`}>
				<a data-dismiss="alert" className="close">&times;</a>
				{this.state.text || this.props.children}
			</div>
	    );
    }

  }
}

export const NotificationRef = React.createRef();

Object.defineProperty(window, 'react_sync_notification', {
	value: newstate => {
    if (typeof newstate === 'string') {
      newstate = { text: newstate };
    }
    const theNotification = NotificationRef.current;
    const fn = theNotification.setState.bind(theNotification);
    fn({ visible: true, ...newstate });
	}
});

const container = document.createElement('div');
container.className = 'fixed-top';
container.style.top = 0;
container.style.left = 0;
container.style.right = 0;
container.style.position = 'fixed';
container.style.zIndex = 999999;

document.body.appendChild(container);
ReactDOM.render(<Notification ref={NotificationRef} />, container);

export default Notification;
