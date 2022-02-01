import React from 'react';
import { AgencyFinderForm } from './AgencyFinderForm';
import { AgencyFinderResults } from './AgencyFinderResults';

class AgencyFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
    };
  }

  handleCallback= (input) => {
    this.setState({
      results: input,
    });
  }

  render() {
    return (
      <div>
        <h1>Find an Agency</h1>
        <p className='instructions'>🔍 Search for your address to find the closest agencies.</p>
        <div className='left-panel'>
          <AgencyFinderForm handleCallback={this.handleCallback} />
        </div>
        <div className='right-panel'>
          <h2>Results</h2>
          <AgencyFinderResults hits={this.state.results} />
        </div>
      </div>
    )
  }
}

export { AgencyFinder };