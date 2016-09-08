import React, { Component } from 'react';
import './style/App.css';
import xhr from 'xhr';
import Plot from './Plot.js';
import { connect } from 'react-redux';
import {
  changeLocation,
  setData,
  setDates,
  setTemps,
  setSelectedTemp,
  setSelectedDate
 } from './actions';

class App extends Component {



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
      component.props.dispatch(setData(body));
      component.props.dispatch(setDates(dates));
      component.props.dispatch(setTemps(temps));
    });
  };

  changeLocation = (event) => {
    this.props.dispatch(changeLocation(event.target.value))
  };




  onPlotClick = (data) => {
    console.log(data)
    if (data.points) {
      let number = data.points[0].pointNumber
      this.props.dispatch(setSelectedDate(this.props.dates[number]));
      this.props.dispatch(setSelectedTemp(this.props.temps[number]));
    }
  };

  render() {
    let currentTemp = 'not loaded yet';
    if (this.props.data.list) {
      currentTemp = this.props.data.list[0].main.temp;
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
        {/* Render plot and current temp if data has generated */}
        {(this.props.data.list) ? (
          <div className="wrapper">
            {/* Render the current temperature if no specific date is selected */}
            {(this.props.selected.temp) ? (
              <p> The temperature on { this.props.selected.date } will be { this.props.selected.temp } °C </p>
            ) : (
              <p> The current temperature in { this.props.location } is { currentTemp }°C.</p>
            )}

              <h2>Forecast</h2>
              <Plot
                xData={this.props.dates}
                yData={this.props.temps}
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
    data: state.data,
    dates: state.dates,
    temps: state.temps,
    selected: state.selected

  };
}

export default connect(mapStateToProps)(App);
