import React, { Component } from "react"
import { compose } from "recompose"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps"
import ReactTable from 'react-table'
import 'react-table/react-table.css'

const MapWithAMarker = compose(withScriptjs, withGoogleMap)(props => {

  return (
    <GoogleMap  zoom={props.defaultZoom} center={{lat: props.lat, lng:props.lng}} >
      {props.markers.map(marker => {
        const onClick = props.onClick.bind(this, marker)
		return (
          <Marker
			key={marker.number}
            onClick={onClick}
            position={{ lat: marker.currentLat, lng: marker.currentLong }}
			//icon={logo}
          >
          {   (props.selectedMarker.number == marker.number) && 
			  <InfoWindow
				defaultOptions={{ disableAutoPan: true }}>
                <div style={{ width: `50%`}} style={{fontSize: '70%'}}>
                  {marker.number}-{marker.name}-
                
				  {marker.currentLocation}
                </div>
              </InfoWindow>
		  }
             
            
          </Marker>
        )
})}
    </GoogleMap>
  )
})

export default class ShelterMap extends Component {
	
	 constructor() {
    super();

	this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
	this.stopTimer = this.stopTimer.bind(this);
	this.countDown = this.countDown.bind(this);
	this.tempoUp = this.tempoUp.bind(this);
  this.tempoDown = this.tempoDown.bind(this);
  this.resetZoom = this.resetZoom.bind(this);
  this.count = 0;
  this.nextCount = 0;
	this.state = {
	  time: {}, seconds: 0, speed: 100,
		
	  trainData : {},
      trains: [],
    selectedMarker: false,
    center: {zoomLat :21.146, zoomLong : 79.088},
    //zoomLat :21.146, zoomLong : 79.088,
    zoom:5
    };
	
	this.componentDidMountBoo = this.componentDidMountBoo.bind(this);
  }
  
  secondsToTime(secs){
	  
	let days = Math.floor(secs / (60 * 60 * 24));  
	  
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
	  "d": days,	
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
  
  getDaysToTime(secs){
    let days = Math.floor(secs / (60 * 60 * 24));

    return days;
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
	  //let seconds = this.state.seconds;
	  
	  speed = speed/10;
	  this.setState({
		  speed:speed
		  //time: this.secondsToTime(seconds),
      //seconds: seconds,
	  });
  }
  
  tempoDown(){
	  let speed  = this.state.speed;
	  //let seconds = this.state.seconds;
	  
	  speed = speed*10;
	  this.setState({
		  speed:speed
		  //time: this.secondsToTime(seconds),
      //seconds: seconds,
	  });
  }

  countDown() {
	  
	  let seconds = this.state.seconds;
	  if(seconds % (10000/this.state.speed) == 0){
		this.componentDidMountBoo(seconds, (seconds + 10000/this.state.speed - 1),this.state.trainData);
	  }
    // add one second, set state so a re-render happens.
     seconds = seconds+ 1;
    this.setState({
	 time: this.secondsToTime(seconds),
      seconds: seconds,
    });
	
	
    
  }
  
  resetZoom () {
    //console.log({ marker })
    clearInterval(this.timer); 
   this.setState({ selectedMarker: false })
   this.setState({ zoom: 5, center: {zoomLat :21.146, zoomLong : 79.088}})
   setTimeout(this.startTimer,
    2000
  )
 }


  componentDidMountBoo(start = 0, end = 500, content={}) {
	  
  function postData(url = ``, data = {}) {
  // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
       // mode: "cors", // no-cors, cors, *same-origin
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

  /*
   waitUntil(() => postData(`http://localhost:8080/Railways-Back-end/api/trainStatus?startTime=`+this.getSecondsToTime(start)+`&endTime=`+this.getSecondsToTime(end)+`&stationCheck=true`+`&trackCheck=true`+`&startDay=`+this.getDaysToTime(start), content)
  .then(data => { console.log(data);
  */
  if(this.count === this.nextCount){
	  this.nextCount =  this.nextCount+1;
  waitUntil(() => postData(`http://railwaysbackend-env2.3mhzppramj.us-east-2.elasticbeanstalk.com/api/trainStatus?startTime=`+this.getSecondsToTime(start)+`&endTime=`+this.getSecondsToTime(end)+`&stationCheck=true`+`&trackCheck=true`+`&startDay=`+this.getDaysToTime(start), content)
  .then(data => { console.log(data);
	  if (data.trainDetail.length > 0 ){
	  this.setState({trains: data.trainDetail});
	  this.setState({trainData: data});
	  this.count = this.count +1;
	  }
	  
	  
  }) // JSON-string from `response.json()` call
  .catch(error => console.error(error)));

  
  }
  }

  handleClick = (marker) => {
     //console.log({ marker })
    clearInterval(this.timer);
    this.setState({ selectedMarker: marker })
    this.setState({ zoom: 10, center:{zoomLat: marker.currentLat, zoomLong:marker.currentLong}})
    
    setTimeout(this.startTimer,
      2000
    )
    
  }
  
  onZoomChanged(){
    clearInterval(this.timer);
    this.setState({selectedMarker: false})
    setTimeout(this.startTimer,
      500
    )

  }
  
  onCenterChanged(){
    clearInterval(this.timer);
    this.setState({selectedMarker: false})
    setTimeout(this.startTimer,
      500
    )
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
  }
  ,{
    Header: 'Delayed By',
    accessor: 'lateBy'
  },
  {
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
       <div className="ShelterMap">
		
        <p className="App-intro">
			<button onClick={this.startTimer}>Start</button>
			 d:{this.state.time.d} h:{this.state.time.h}  m:{this.state.time.m}  s:{this.state.time.s} 
			<button onClick={this.stopTimer}>Stop</button>
			
      <button alignright onClick={this.resetZoom}>Reset Zoom</button>
        </p>
		 <MapWithAMarker
        ref="map"
        selectedMarker={this.state.selectedMarker}
        markers={this.state.trains}
        onClick={this.handleClick}
        defaultZoom={this.state.zoom}
        lat={this.state.center.zoomLat}
        lng={this.state.center.zoomLong}
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
	  <ReactTable
    data={trains}
    columns={columns}
	getTdProps={(state, rowInfo, column, instance) => {
    return {
      onClick: (e, handleOriginal) => {
        console.log("A Td Element was clicked!");
        //console.log("it produced this event:", e);
        //console.log("It was in this column:", column);
        //console.log("It was in this row:", rowInfo);
        //console.log("It was in this table instance:", instance);

        // IMPORTANT! React-Table uses onClick internally to trigger
        // events like expanding SubComponents and pivots.
        // By default a custom 'onClick' handler will override this functionality.
        // If you want to fire the original onClick handler, call the
        // 'handleOriginal' function.
        clearInterval(this.timer);
		this.setState({ zoom: 10, center:{
			zoomLat: rowInfo.original.currentLat,
      zoomLong: rowInfo.original.currentLong
    }
    
    })
    setTimeout(this.startTimer,
      2000
    )
    
    /*
        if (handleOriginal) {
          handleOriginal();
        }
        */
      }
    };
  }}
  />
      </div>
    ):(
       <div className="ShelterMap">
		
        <p className="App-intro">
			<button onClick={this.startTimer}>Start</button>
			 d:{this.state.time.d}  h:{this.state.time.h}  m:{this.state.time.m}  s:{this.state.time.s} 
			<button onClick={this.stopTimer}>Stop</button>
			
      <button alignright onClick={this.resetZoom}>Reset Zoom</button>
        </p>
		 <MapWithAMarker
        ref="map"
        selectedMarker={this.state.selectedMarker}
        markers={this.state.trains}
        onClick={this.handleClick}
        defaultZoom={this.state.zoom}
      
        lat={this.state.center.zoomLat}
        lng={this.state.center.zoomLong}
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
	  <ReactTable
    //data={this.data.trains}
    columns={columns}
  />
      </div>
    ));
     
    
  }
}

