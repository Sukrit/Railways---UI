import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ShelterMap from './Map';
import Timer from './Timer';
import registerServiceWorker from './registerServiceWorker';

//ReactDOM.render(<Timer />, document.getElementById('View'));
ReactDOM.render(<ShelterMap />, document.getElementById('root'));
registerServiceWorker();
