import React, { Component } from 'react';
import MesoContainer from './components/MesoContainer'; 
import { Badge } from 'reactstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
		    <h4> <strong> <Badge color="primary"> IoTGas </Badge>  </strong> </h4>
  		<MesoContainer/>
      </div>
    );
  }
}

export default App;
