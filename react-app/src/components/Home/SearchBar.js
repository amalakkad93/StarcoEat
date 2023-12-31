import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { getKey } from "../../store/maps";
import './home.css';


// The SearchBar component is responsible for rendering a location search input field
// using the Google Maps API. It loads the API script and handles place selection.

function SearchBar({ onPlaceSelected }) {
  const dispatch = useDispatch();
  const searchBoxRef = useRef(null);
  const apiKey = useSelector((state) => state.maps.key, shallowEqual);

  // Fetch the Google Maps API key from the Redux store when the component mounts.
  useEffect(() => {
    dispatch(getKey());
  }, [dispatch]);

  // Callback function triggered when places change in the search box.
  const onPlacesChanged = () => {
    if (!searchBoxRef.current) return;
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) onPlaceSelected(places[0]);
  };

  return apiKey ? (
    <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
      <StandaloneSearchBox onLoad={(ref) => (searchBoxRef.current = ref)} onPlacesChanged={onPlacesChanged}>
        <div className="search-input-container">
          <i className="fas fa-search search-input-icon"></i> 
          <input type="text" className="search-input" placeholder="Enter a delivery address" />
        </div>
      </StandaloneSearchBox>
    </LoadScript>
  ) : null;
}

export default SearchBar;
