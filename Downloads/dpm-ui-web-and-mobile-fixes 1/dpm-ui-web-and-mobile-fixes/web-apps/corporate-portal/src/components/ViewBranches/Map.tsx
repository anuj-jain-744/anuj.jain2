import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  ZoomIncontroller,
  ZoomOutcontroller,
} from "../../assets/ViewBranches";
import { CustomMarker } from "../../assets/ViewBranches";

interface Marker {
  latitude: string;
  longitude: string;
  branch_type: string;
  place_id: string;
  address: string;
  title: string;
}

interface BranchMapProps {
  markerList: Marker[];
  selectedMarker: number;
}

const BranchMap: React.FC<BranchMapProps> = ({ markerList, selectedMarker }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  let currentInfoWindow: google.maps.InfoWindow | null = null;

  const normalizeMarkerList = (markerList: Marker[]) => {
    return markerList.map((marker) => ({
      lat: Number(marker.latitude),
      lng: Number(marker.longitude),
      details: marker.branch_type,
      place_id: marker.place_id,
      address: marker.address,
      label: {
        text: `${marker.title}, ${marker.branch_type}`,
        className: "custom-marker-label",
      },
    }));
  };

  const animatePanTo = (map: google.maps.Map, targetLatLng: google.maps.LatLng) => {
    const startLatLng = map.getCenter();
    const deltaLat = (targetLatLng.lat() - startLatLng.lat()) / 100;
    const deltaLng = (targetLatLng.lng() - startLatLng.lng()) / 100;
    let step = 0;

    const interval = setInterval(() => {
      if (step < 100) {
        step += 1;
        map.panTo({
          lat: startLatLng.lat() + deltaLat * step,
          lng: startLatLng.lng() + deltaLng * step,
        });
      } else {
        clearInterval(interval);
      }
    }, 10);
  };

  useEffect(() => {
    if (markerList.length > 0) {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: "weekly",
      });

      loader.load().then(() => {
        if (mapRef.current) {
          const normalizedItem = normalizeMarkerList(markerList);

          mapInstance.current = new google.maps.Map(mapRef.current, {
            center: normalizedItem[selectedMarker],
            zoom: 12,
            zoomControl: false,
          });

          normalizedItem.forEach((position, index) => {
            const marker = new google.maps.Marker({
              position,
              map: mapInstance.current,
              title: position?.details,
              icon: CustomMarker,
              label: position.label,
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `<div class="custom-info-window">
                        <div class="dialog-window">
                           <div class="details"> 
                          <p>${position.address}</p>
                          </div>
                          <div class="navigate">
                          <a aria-label="Get directions to this location on Google Maps." href="https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}&destination_place_id=${position.place_id}" target="_blank" >
                            <div class="navigate-icon"></div>
                            <div class="navigate-text">Direction</div>
                          </a>
                         </div>  
                        </div>
                          <a aria-label="View larger map on Google Maps." href="https://www.google.com/maps/place/?q=place_id:${position.place_id}&ll=${position.lat},${position.lng}" target="_blank" >
                            <div class="view-larger-map-icon"></div>
                            <div class="view-larger-map-text">View Larger Map</div>
                          </a> 
                         </div>`,
            });

            marker.addListener("click", () => {
              if (currentInfoWindow) {
                currentInfoWindow.close();
              }
              infoWindow.open(mapInstance.current, marker);
              currentInfoWindow = infoWindow;
              new google.maps.event.addListenerOnce(
                infoWindow,
                "domready",
                () => {
                  const iwOuter = document.querySelector(".gm-style-iw-ch");
                  if (iwOuter) {
                    iwOuter.innerText = position.label.text;
                  }
                }
              );
            });
          });

          // custom zoom in button
          const zoomInButton = document.createElement("div");
          zoomInButton.innerHTML = `<img src=${ZoomIncontroller} alt="Zoom In"/>`;
          zoomInButton.className = "custom-map-control-zoom-in";

          // custom zoom out button
          const zoomOutButton = document.createElement("div");
          zoomOutButton.innerHTML = `<img src=${ZoomOutcontroller} alt="Zoom Out"/>`;
          zoomOutButton.className = "custom-map-control-zoom-out";

          // event listeners to the buttons
          zoomInButton.addEventListener("click", () => {
            mapInstance.current?.setZoom(mapInstance.current.getZoom() + 1);
          });

          zoomOutButton.addEventListener("click", () => {
            mapInstance.current?.setZoom(mapInstance.current.getZoom() - 1);
          });

          // Append buttons to the map
          mapInstance.current.controls[
            google.maps.ControlPosition.TOP_LEFT
          ].push(zoomInButton);
          mapInstance.current.controls[
            google.maps.ControlPosition.TOP_LEFT
          ].push(zoomOutButton);
        }
      });
    }
  }, [markerList, selectedMarker]);

  useEffect(() => {
    if (mapInstance.current && markerList[selectedMarker]) {
      const normalizedItem = normalizeMarkerList(markerList);
      const targetLatLng = new google.maps.LatLng(
        normalizedItem[selectedMarker].lat,
        normalizedItem[selectedMarker].lng
      );
      animatePanTo(mapInstance.current, targetLatLng);
    }
  }, [selectedMarker, markerList]);

  return <div ref={mapRef} className="map-container" />;
};

export default BranchMap;