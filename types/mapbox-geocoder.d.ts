declare module "@mapbox/mapbox-gl-geocoder" {
  import { IControl } from "mapbox-gl";

  interface GeocoderOptions {
    accessToken: string;
    mapboxgl?: any;
    zoom?: number;
    flyTo?: boolean | object;
    placeholder?: string;
    proximity?: {
      longitude: number;
      latitude: number;
    };
    trackProximity?: boolean;
    collapsed?: boolean;
    clearAndBlurOnEsc?: boolean;
    clearOnBlur?: boolean;
    bbox?: [number, number, number, number];
    countries?: string;
    types?: string;
    minLength?: number;
    limit?: number;
    language?: string;
    filter?: (feature: any) => boolean;
    localGeocoder?: (query: string) => any[];
    externalGeocoder?: (query: string, features: any[]) => any[];
    reverseMode?: "distance" | "score";
    reverseGeocode?: boolean;
    enableEventLogging?: boolean;
    marker?: boolean;
    render?: (feature: any) => string;
    getItemValue?: (feature: any) => string;
  }

  export default class MapboxGeocoder implements IControl {
    constructor(options: GeocoderOptions);
    onAdd(map: any): HTMLElement;
    onRemove(): void;
    query(searchInput: string): this;
    setInput(searchInput: string): this;
    setProximity(proximity: { longitude: number; latitude: number }): this;
    setRenderFunction(fn: (feature: any) => string): this;
    setLanguage(language: string): this;
    setZoom(zoom: number): this;
    setFlyTo(flyTo: boolean | object): this;
    setCountries(countries: string): this;
    setTypes(types: string): this;
    setMinLength(minLength: number): this;
    setLimit(limit: number): this;
    setFilter(filter: (feature: any) => boolean): this;
    setBbox(bbox: [number, number, number, number]): this;
    clear(): this;
    on(event: string, listener: (...args: any[]) => void): this;
    off(event: string, listener: (...args: any[]) => void): this;
  }
}
