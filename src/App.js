import React, { Component } from 'react';
import './style/App.css';
import xhr from 'xhr';
import Plot from './Plot.js';

class App extends Component {

    state = {
      location: '',
      data: {},
      dates: [],
      templs: [],
    };


  fetchData = (event) => {
    event.preventDefault();
    console.log("Fetching Data..", this.state.location)

    let location = encodeURIComponent(this.state.location)

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
        temps: temps

      });
    });
  };

  changeLocation = (event) => {
    this.setState({
      location: event.target.value
    });
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
              value={this.state.location}
              onChange={this.changeLocation}
             />
          </label>
        </form>
        {(this.state.data.list) ? (
        <div className="wrapper">
          <p className="temp-wrapper">
            <span className="temp">{ currentTemp }</span>
            <span className="temp-symbol">°C</span>
          </p>
          <h2>Forecast</h2>
          <Plot
            xData={this.state.dates}
            yData={this.state.temps}
            type="scatter"
          />
      </div>
    ) : null}

    </div>
    );
  }
}

export default App;
