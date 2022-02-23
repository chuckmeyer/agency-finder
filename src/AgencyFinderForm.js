/* global google */
import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import Checkbox from './Checkbox';

const geoIndex = process.env.REACT_APP_ALGOLIA_INDEX_GEO;
const statesIndex = process.env.REACT_APP_ALGOLIA_INDEX_STATES;

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
    const queries = [{
      indexName: statesIndex,
      query: this.state.state,
      params: {
        hitsPerPage: 10
      }
    }, {
      indexName: geoIndex,
      query: '',
      params: {
        aroundLatLng: this.state.geoCode,
        facetFilters: [ this.state.preferred ? 'preferred:true' : '' ],
        hitsPerPage: 10,
      }
    }];
    
    this.searchClient.multipleQueries(queries).then(({ results }) => {
      console.log(results);
      let allHits = [];
      results.map((result) => {
        return allHits.push(...result.hits);
      });
      this.props.handleCallback(allHits);
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
    const address = addressObject.address_components.reduce((seed, { short_name, types }) => {
  		types.forEach(t => {
    		seed[t] = short_name;
  		});
	  	return seed;
		}, {});
    this.setState({
      streetAddress: `${address.street_number} ${address.route}`,
      city: address.locality ? address.locality : address.sublocality_level_1,
      state: address.administrative_area_level_1,
      zipCode: address.postal_code,
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
    this.searchClient = algoliasearch(
      process.env.REACT_APP_ALGOLIA_APP_ID,
      process.env.REACT_APP_ALGOLIA_API_KEY
    );
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
            type="text"
          />

          <input
            readOnly
            name={'streetAddress'}
            value={this.state.streetAddress}
            placeholder={'Street Address'}
            onChange={this.handleChange}
          />
          <input
            readOnly
            name={'city'}
            value={this.state.city}
            placeholder={'City'}
            onChange={this.handleChange}
          />
          <input
            readOnly
            name={'state'}
            value={this.state.state}
            placeholder={'State'}
            onChange={this.handleChange}
          />
          <input
            readOnly
            name={'zipCode'}
            value={this.state.zipCode}
            placeholder={'Zipcode'}
            onChange={this.handleChange}
          />
          <label>
            {/* Built with a ton of help from https://medium.com/@colebemis/building-a-checkbox-component-with-react-and-styled-components-8d3aa1d826dd */}
            <Checkbox
              name='preferred'
              checked={this.state.preferred}
              onChange={this.handleCheckboxChange}  
            />
            <span style={{ marginLeft: 8 }}>Preferred Agencies</span>
          </label>
        </form>
        <button onClick={this.handleSubmit}>Search</button>
        <button onClick={this.handleClear}>Clear</button>
      </div>
    );
  }
}

export { AgencyFinderForm };
