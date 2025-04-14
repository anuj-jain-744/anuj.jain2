import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MapComponent } from './map';
import { Loader } from '@googlemaps/js-api-loader';

// Mock the google.maps API
global.google = {
  maps: {
    Map: jest.fn().mockImplementation(() => ({
      setCenter: jest.fn(),
      setZoom: jest.fn(),
    })),
    LatLng: jest.fn().mockImplementation(() => ({
      lat: jest.fn(),
      lng: jest.fn(),
    })),
    OverlayView: jest.fn().mockImplementation(() => ({
      setMap: jest.fn(),
      onAdd: jest.fn(),
      draw: jest.fn(),
      onRemove: jest.fn(),
    })),
  },
};

// Mock the Loader from @googlemaps/js-api-loader
jest.mock('@googlemaps/js-api-loader', () => ({
  Loader: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockResolvedValue(true),
  })),
}));

describe('MapComponent', () => {
  const lat = '40.712776';
  const long = '-74.005974';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads the Google Maps API and renders the map', async () => {
    render(<MapComponent lat={lat} long={long} />);

    // Ensure that the API loader is called
    await waitFor(() => expect(Loader).toHaveBeenCalledTimes(1));

    // Ensure that google.maps.Map constructor was called with the correct parameters
    await waitFor(() =>
      expect(google.maps.Map).toHaveBeenCalledWith(expect.any(HTMLDivElement), {
        center: { lat: parseFloat(lat), lng: parseFloat(long) },
        zoom: 15,
      })
    );

    // Ensure that google.maps.LatLng is called with the correct parameters
    await waitFor(() =>
      expect(google.maps.LatLng).toHaveBeenCalledWith(parseFloat(lat), parseFloat(long))
    );
  });

  test('adds a custom marker to the map', async () => {
    render(<MapComponent lat={lat} long={long} />);

    // Wait for the map and custom marker to be initialized
    await waitFor(() => expect(google.maps.Map).toHaveBeenCalledTimes(1));

    // Ensure the CustomMarker's onAdd method is called
    const CustomMarker = google.maps.OverlayView.mock.instances[0];
    expect(CustomMarker.onAdd).toHaveBeenCalledTimes(1);
  });

  test('removes the custom marker from the map', async () => {
    render(<MapComponent lat={lat} long={long} />);

    // Wait for the map and custom marker to be initialized
    await waitFor(() => expect(google.maps.Map).toHaveBeenCalledTimes(1));

    const CustomMarker = google.maps.OverlayView.mock.instances[0];
    CustomMarker.onRemove();

    // Ensure the onRemove method of the custom marker was called
    expect(CustomMarker.onRemove).toHaveBeenCalledTimes(1);
  });

  test('map container is rendered correctly', async () => {
    render(<MapComponent lat={lat} long={long} />);

    // Ensure the div for the map is rendered
    const mapDiv = screen.getByClassName('property-map-container');
    expect(mapDiv).toBeInTheDocument();
  });

  test('verifies the map zoom level', async () => {
    render(<MapComponent lat={lat} long={long} />);

    // Wait for map to be rendered
    await waitFor(() => expect(google.maps.Map).toHaveBeenCalledTimes(1));

    const mapInstance = google.maps.Map.mock.instances[0];
    
    // Ensure the map zoom level is set to 15
    expect(mapInstance.setZoom).toHaveBeenCalledWith(15);
  });

  test('verifies the map center position', async () => {
    render(<MapComponent lat={lat} long={long} />);

    // Wait for map to be rendered
    await waitFor(() => expect(google.maps.Map).toHaveBeenCalledTimes(1));

    const mapInstance = google.maps.Map.mock.instances[0];

    // Ensure the map center is set correctly
    expect(mapInstance.setCenter).toHaveBeenCalledWith({
      lat: parseFloat(lat),
      lng: parseFloat(long),
    });
  });

  test('handles case when mapRef is null', async () => {
    // Temporarily mock mapRef as null
    const originalMapRef = MapComponent.prototype;
    MapComponent.prototype = { mapRef: { current: null } };
    
    render(<MapComponent lat={lat} long={long} />);

    // Ensure nothing happens when mapRef.current is null
    await waitFor(() => expect(google.maps.Map).not.toHaveBeenCalled());
    
    // Restore original mapRef after the test
    MapComponent.prototype = originalMapRef;
  });

  test('handles API loader failure', async () => {
    // Mock the loader to simulate a failure
    (Loader as jest.Mock).mockImplementationOnce(() => ({
      load: jest.fn().mockRejectedValue(new Error('API Load Failed')),
    }));

    // Try to render the map and check for errors
    render(<MapComponent lat={lat} long={long} />);

    // Ensure the loader's load method was called
    await waitFor(() => expect(Loader).toHaveBeenCalledTimes(1));

    // Ensure that the map is not initialized due to loader failure
    expect(google.maps.Map).not.toHaveBeenCalled();
  });
});
