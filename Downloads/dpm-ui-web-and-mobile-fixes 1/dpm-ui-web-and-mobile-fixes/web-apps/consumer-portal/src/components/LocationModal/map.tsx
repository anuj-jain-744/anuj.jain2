import { useRef, useEffect } from "react";
import { VITE_GOOGLE_MAPS_API_KEY, commonKeywords } from "../../constant";
import { LocationHomeIcon } from "assets/CommonSVG";
import { Loader } from "@googlemaps/js-api-loader";

interface MapComponentProps {
  lat: string;
  long: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({ lat, long }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: VITE_GOOGLE_MAPS_API_KEY,
      version: commonKeywords.weekly,
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: parseFloat(lat), lng: parseFloat(long) },
          zoom: 15,
        });

        class CustomMarker extends google.maps.OverlayView {
          position: google.maps.LatLng;
          div: HTMLDivElement | null;

          constructor(position: google.maps.LatLng) {
            super();
            this.position = position;
            this.div = null;
          }

          onAdd() {
            this.div = document.createElement("div");
            this.div.className = "custom-marker";
            this.div.innerHTML = `<img src=${LocationHomeIcon} class="custom-marker-icon" />`;
            const panes = this.getPanes();
            panes?.overlayImage.appendChild(this.div);
          }

          draw() {
            if (this.div) {
              const point = this.getProjection().fromLatLngToDivPixel(
                this.position
              );
              if (point) {
                this.div.style.left = `${point.x}px`;
                this.div.style.top = `${point.y}px`;
              }
            }
          }

          onRemove() {
            if (this.div) {
              this.div.parentNode?.removeChild(this.div);
              this.div = null;
            }
          }
        }

        const position = new google.maps.LatLng(
          parseFloat(lat),
          parseFloat(long)
        );
        const customMarker = new CustomMarker(position);
        customMarker.setMap(map);
      }
    });
  }, [lat, long]);

  return (
    <div
      ref={mapRef}
      className="property-map-container"
    />
  );
};