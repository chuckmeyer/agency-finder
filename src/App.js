import React from 'react';
import { AgencyFinder } from './AgencyFinder';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import './App.css';

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return <h3>{status} ..</h3>;
    case Status.FAILURE:
      return <h3>{status} ..</h3>;
    case Status.SUCCESS:
      return <AgencyFinder />;
    }
};

function App() {
  return (
    <div className="App">
      <Wrapper apiKey={process.env.REACT_APP_GOOGLE_API_KEY} render={render} libraries={["places"]} />
    </div>
  );
}

export default App;
