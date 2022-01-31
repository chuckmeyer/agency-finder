function AgencyFinderResults(props) {
  return (
    <div className='search-results'>
        <ul>
          {props.hits ?
            props.hits.map((hit) =>
              <li key={hit.name}>
                <span>{hit.name}</span><span>{hit.city}, {hit.state}</span></li>
              ) :
            <li>No results</li>
          }
        </ul>
    </div>
  );
}

export { AgencyFinderResults };