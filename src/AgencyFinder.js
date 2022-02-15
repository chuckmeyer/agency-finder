import React from 'react';
import { AgencyFinderForm } from './AgencyFinderForm';
import { AgencyFinderResults } from './AgencyFinderResults';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import './AgencyFinder.css';

class AgencyFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
    };
    this.renderForm = this.renderForm.bind(this);
  }

  handleCallback = (input) => {
    this.setState({
      results: input,
    });
  }

  renderForm = (status) => {
    switch (status) {
      case Status.SUCCESS:
        return <AgencyFinderForm handleCallback={this.handleCallback} />;
      default:
        return <h3>{status} ...</h3>;
      };
  }

  render() {
    return (
      <div>
        <h1>Find an Agency</h1>
        <p className='instructions'>🔍 Search for your address to find the closest agencies.</p>
        <div className='left-panel'>
          <Wrapper apiKey={process.env.REACT_APP_GOOGLE_API_KEY} render={this.renderForm} libraries={["places"]} />
        </div>
        <div className='right-panel'>
          <AgencyFinderResults hits={this.state.results} />
        </div>
      </div>
    )
  }
}

export { AgencyFinder };