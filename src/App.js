import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class App extends Component {
   	
  	
  constructor() {
    super();

	this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
	this.countDown = this.countDown.bind(this);
	this.tempoUp = this.startTimer.bind(this);
	this.tempoDown = this.startTimer.bind(this);
	this.state = {
	  time: {}, seconds: 0, speed: 10,
		
	  trainData : {},
      trains: [],
    };
	
	this.componentDidMountBoo = this.componentDidMountBoo.bind(this);
  }
  
  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
       "m": minutes,
      "s": seconds
    };
    return obj;
  }
  
  
  getSecondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    return hours+':'+minutes+':'+seconds;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  startTimer() {
    //if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, this.state.speed);
	  
    //}
  }
  
  stopTimer() {
    clearInterval(this.timer);
  }
  
  tempoUp() {
	  let speed  = this.state.speed;
	  let seconds = this.state.seconds;
	  
	  speed = speed/10;
	  this.setState({
		  speed:speed,
		  time: this.secondsToTime(seconds),
      seconds: seconds,
	  });
  }
  
  tempoDown(){
	  let speed  = this.state.speed;
	  let seconds = this.state.seconds;
	  
	  speed = speed*10;
	  this.setState({
		  speed:speed,
		  time: this.secondsToTime(seconds),
      seconds: seconds,
	  });
  }

  countDown() {
	  
	  let seconds = this.state.seconds;
	  if(seconds % (1000/this.state.speed) == 0){
		this.componentDidMountBoo(seconds, (seconds + 1000/this.state.speed - 1),this.state.trainData);
	  }
    // add one second, set state so a re-render happens.
     seconds = seconds+ 1;
    this.setState({
	 time: this.secondsToTime(seconds),
      seconds: seconds,
    });
	
	
    
  }
  
  componentDidMountBoo(start = 0, end = 500, content={}) {
	  
  function postData(url = ``, data = {}) {
  // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
			"Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    }).then(response => response.json()); // parses response to JSON
}	

  const waitUntil = require('async-wait-until');

   waitUntil(() => postData(`http://localhost:8080/Railways-Back-end/api/trainStatus?startTime=`+this.getSecondsToTime(start)+`&endTime=`+this.getSecondsToTime(end)+`&stationCheck=true`+`&startDay=0`, content)
  .then(data => { console.log(data);
  
	  if (data.trainDetail.length > 0 ){
	  this.setState({trains: data.trainDetail});
	  this.setState({trainData: data});
	  }
	  
	  
  }) // JSON-string from `response.json()` call
  .catch(error => console.error(error)));

  
  }
  
  
   render() {
  const { trains } = this.state
  const columns = [{
    Header: 'Name',
    accessor: 'name' // String-based value accessors!
  }, {
    Header: 'Number',
    accessor: 'number',
    Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
  }, {
    Header: 'Current Location',
    accessor: 'currentLocation' // String-based value accessors!
  },
  {
    Header: 'Delayed',
    accessor: 'delayed',	// String-based value accessors!
	Cell: row => (
      <div>
		{row.value}
        <div
          style={{
            backgroundColor:
              row.value = 'true'
                ? "#ff2e00"
                : "#dadada"
          }}
        />
      </div>
    )
  },{
    Header: 'Percent Completed',
    accessor: 'percentCompleted',
    Cell: row => (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#dadada",
          borderRadius: "2px"
        }}
      >
        <div
          style={{
            width: `${row.value}%`,
            height: "100%",
            backgroundColor:
              row.value > 66
                ? "#85cc00"
                : row.value > 33
                  ? "#ffbf00"
                  : "#ff2e00",
            borderRadius: "2px",
            transition: "all .2s ease-out"
          }}
        />
      </div>
    )
  }]
  return (trains.length ? (
       <div className="App">
		<header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Hello World</h1>
        </header>
        <p className="App-intro">
			<button onClick={this.startTimer}>Start</button>
			h: {this.state.time.h} m: {this.state.time.m} s: {this.state.time.s} 
			<button onClick={this.stopTimer}>Stop</button>
			<button onClick={this.tempoUp}>Tempo Up</button>
			<button onClick={this.tempoDown}>Tempo Down</button>
        </p>
		<ReactTable
    data={trains}
    columns={columns}
  />
      </div>
    ):(
       <div className="App">
		<header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Hello World</h1>
        </header>
        <p className="App-intro">
			<button onClick={this.startTimer}>Start</button>
			h: {this.state.time.h} m: {this.state.time.m} s: {this.state.time.s} 
			<button onClick={this.stopTimer}>Stop</button>
			<button onClick={this.tempoUp}>Tempo Up</button>
			<button onClick={this.tempoDown}>Tempo Down</button>
        </p>
		<ReactTable
    //data={this.data.trains}
    columns={columns}
  />
      </div>
    ));
  }
}

export default App;
