import React, { Component } from 'react';

class Box extends Component {
  constructor() {
    super();    
    this.state = {
        // style: {
        //   backgroundColor: '#' + Math.random().toString(16).substr(-6)
        // }
        style: {        
           backgroundColor: "rgba("+Math.floor(Math.random() * 255)+", 220, 0, 0.3)"
         }
    }
  }

  componentDidMount() {
    this.timerID = setInterval(
          () => this.tick(),
          1000
        );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  tick() {
    this.setState({
      style: {
          backgroundColor: "rgba("+Math.floor(Math.random() * 255)+", 220, 0, 0.3)"
        }
    });
  }
  render() {    
    return (
       <div onClick={this.props.toggleBoxClick} data-index={this.props.indetifier} className={this.props.numdata.selected ? "box selected" : "box"} style={this.state.style} >
        {this.props.numdata.value}
        </div>  
    )
  }
}

export default Box;
