import React, { Component } from 'react';
import './style/App.css';
import xhr from 'xhr';
import Plot from './Plot.js';
import { connect } from 'react-redux';
import {
  changeLocation,
  setSelectedTemp,
  setSelectedDate
 } from './actions';

class App extends Component {

    state = {
      location: '',
      data: {},
      dates: [],
      temps: [],
    };


  fetchData = (event) => {
    event.preventDefault();
    console.log("Fetching Data..", this.props.location)

    let location = encodeURIComponent(this.props.location)

    const urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    const urlSuffix = '&APPID=647fe2423812e744fd5e264bc9a67c12&units=metric';
    let url = urlPrefix + location + urlSuffix

    let component = this;

    xhr({
      url: url
    }, function (err, data){
      let body = JSON.parse(data.body);
      let list = body.list;
      let dates = [];
      let temps = [];
      for (var i = 0; i < list.length; i++) {
        dates.push(list[i].dt_txt);
        temps.push(list[i].main.temp)
      }
      component.setState({
        data: body,
        dates: dates,
        temps: temps,
      });
    });
  };

  changeLocation = (event) => {
    this.props.dispatch(changeLocation(event.target.value))
  };




  onPlotClick = (data) => {
    console.log(data)
    if (data.points) {
      let number = data.points[0].pointNumber
      this.props.dispatch(setSelectedDate(data.points[0].x));
      this.props.dispatch(setSelectedTemp(data.points[0].y));
    }
  };

  render() {
    let currentTemp = 'not loaded yet';
    if (this.state.data.list) {
      currentTemp = this.state.data.list[0].main.temp;
    }



    return (
      <div>
        <h1> Weather Checker </h1>
        <form onSubmit={this.fetchData}>
          <label> Give me the weather for
            <input
              placeholder={"City, Country"}
              type="text"
              value={this.props.location}
              onChange={this.changeLocation}
             />
          </label>
        </form>
        {(this.state.data.list) ? (
        <div className="wrapper">
        {/* Render the current temperature if no specific date is selected */}
          <p className="temp-wrapper">
            <span className="temp">
              { this.props.selected.temp ? this.props.selected.temp : currentTemp }
            </span>
            <span className="temp-symbol">°C</span>
            <span className="temp-date">
              { this.props.selected.temp ? this.props.selected.date : ''}
            </span>
          </p>
          <h2>Forecast</h2>
          <Plot
            xData={this.state.dates}
            yData={this.state.temps}
            type="scatter"
            onPlotClick={this.onPlotClick}
          />
      </div>
    ) : null}

    </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    location: state.location,
    selected: state.selected
  };
}

export default connect(mapStateToProps)(App);
