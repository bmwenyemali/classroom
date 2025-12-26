declare module "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions" {
  import mapboxgl from "mapbox-gl";

  interface DirectionsOptions {
    accessToken?: string;
    unit?: "imperial" | "metric";
    profile?:
      | "mapbox/driving-traffic"
      | "mapbox/driving"
      | "mapbox/walking"
      | "mapbox/cycling";
    alternatives?: boolean;
    congestion?: boolean;
    interactive?: boolean;
    controls?: {
      inputs?: boolean;
      instructions?: boolean;
      profileSwitcher?: boolean;
    };
  }

  export default class MapboxDirections implements mapboxgl.IControl {
    constructor(options?: DirectionsOptions);
    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(map: mapboxgl.Map): void;
    setOrigin(origin: [number, number] | string): this;
    setDestination(destination: [number, number] | string): this;
    removeRoutes(): this;
    getDefaultPosition():
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right";
  }
}
