import React from 'react';
import './Count-item-component.css';

class CountItem extends React.Component {

  render() {

    return <div id='CountItem'>
    
      <div id='CountCategory'>
        <img src="https://cdn-icons-png.flaticon.com/512/570/570223.png" alt="Icon"/>
        <h4>{this.props.title}</h4>
      </div>

      <div id='CountNumber'>
        <h2>{this.props.count}</h2>
      </div>
    
    </div>;
  }
}

export default CountItem