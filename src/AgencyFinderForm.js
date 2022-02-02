/* global google */
import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import './Form.css';
import Checkbox from './Checkbox';

const geoIndex = process.env.REACT_APP_ALGOLIA_INDEX_GEO;
const statesIndex = process.env.REACT_APP_ALGOLIA_INDEX_STATES;

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_API_KEY
);

class AgencyFinderForm extends React.Component {
  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.autocompleteListener = null;
    this.index = null;
    this.state = this.initialState();
    // this is to set the initial state of the component
    // as you probably
    // know, if you're going to be passing functions around and invoke them as
    // callbacks, you'll need to hold onto 'this' because it's bound at runtime
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  initialState() {
    return {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      geoCode: '',
      googleMapLink: '',
      preferred: false,
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCheckboxChange(event) {
    this.setState({ [event.target.name]: event.target.checked });
  }

  handleSubmit(event) {
    this.geoIndex
      .search('', {
        aroundLatLng: this.state.geoCode,
        facetFilters: [ this.state.preferred ? 'preferred:true' : '' ],
        hitsPerPage: 10,
      })
      .then(({ hits }) => {
        const geoHits = hits;
        this.statesIndex
          .search(this.state.state, {
            hitsPerPage: 10,
          })
          .then(({ hits }) => {
            let allHits = hits;
            allHits.push(...geoHits);
            this.props.handleCallback(allHits);
          });
      });    
  }

  handleClear() {
    this.setState(this.initialState);
    var input = document.getElementById('autocomplete');
    input.value = '';
    google.maps.event.removeListener(this.autocompleteListener);
    this.initAutocomplete();
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace();
    let address = addressObject.address_components;
    this.setState({
      streetAddress: `${address[0].long_name} ${address[1].short_name}`,
      city: address[3].long_name,
      state: address[5].short_name,
      zipCode: address[7].short_name,
      geoCode: addressObject.geometry.location.lat() + ', ' + addressObject.geometry.location.lng(),
      googleMapLink: addressObject.url
    });
  }

  initAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      {}
    );
    this.autocompleteListener = this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  initSearch() {
    this.geoIndex = searchClient.initIndex(geoIndex);
    this.statesIndex = searchClient.initIndex(statesIndex);
  }

  componentDidMount() {
    this.initAutocomplete();
    this.initSearch();
  }

  render() {
    return (
      <div className='search-form'>
        <form onSubmit={this.handleSubmit}>
          <input
            id="autocomplete"
            className="input-field"
            ref="input"
            type="text"
          />

          <input
            name={'streetAddress'}
            value={this.state.streetAddress}
            placeholder={'Street Address'}
            onChange={this.handleChange}
          />
          <input
            name={'city'}
            value={this.state.city}
            placeholder={'City'}
            onChange={this.handleChange}
          />
          <input
            name={'state'}
            value={this.state.state}
            placeholder={'State'}
            onChange={this.handleChange}
          />
          <input
            name={'zipCode'}
            value={this.state.zipCode}
            placeholder={'Zipcode'}
            onChange={this.handleChange}
          />
          <label>
            {/* Built with a ton of help form https://medium.com/@colebemis/building-a-checkbox-component-with-react-and-styled-components-8d3aa1d826dd */}
            <Checkbox
              name='preferred'
              checked={this.state.preferred}
              onChange={this.handleCheckboxChange}  
            />
            <span style={{ marginLeft: 8 }}>Preferred Agencies</span>
          </label>
        </form>
        <button onClick={this.handleSubmit}>Submit</button>
        <button onClick={this.handleClear}>Clear</button>
      </div>
    );
  }
}

export { AgencyFinderForm };
