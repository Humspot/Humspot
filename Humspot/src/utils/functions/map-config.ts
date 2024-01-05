/**
 * @file map-config.ts
 * @fileoverview contains the configuration for the pigeon maps component (Maps page, or tab 2).
 */

export const MAP_TILER_KEY: string = 'c9MoaJaVglEims9riUks';
export function mapTiler(darkMode: boolean, x: number, y: number, z: number, dpr: number | undefined): string {
  let MAP_TILER_ID: string = darkMode ? 'streets-v2-dark' : 'streets';
  return `https://api.maptiler.com/maps/${MAP_TILER_ID}/256/${z}/${x}/${y}.png?key=${MAP_TILER_KEY}`
};


export const zoomControlButtonsStyleDark = {
  width: "50px",
  height: '50px',
  borderRadius: '5px',
  boxShadow: '0 1px 4px -1px rgba(0,0,0,.3)',
  background: 'var(--ion-color-light)',
  lineHeight: '25px',
  fontSize: '20px',
  fontWeight: '500',
  color: 'WHITE',
  cursor: 'pointer',
  border: '0.5px solid var(--ion-color-medium)',
  display: 'block',
  outline: 'none',
  textIndent: '0px',
}; // +/- buttons that appear on map can be styled here (dark mode version)

export const zoomControlButtonsStyle = {
  width: "50px",
  height: '50px',
  borderRadius: '5px',
  boxShadow: '0 1px 4px -1px rgba(0,0,0,.3)',
  background: 'var(--ion-color-light)',
  lineHeight: '25px',
  fontSize: '20px',
  fontWeight: '500',
  color: 'BLACK',
  cursor: 'pointer',
  border: '0.5px solid var(--ion-color-warning)',
  display: 'block',
  outline: 'none',
  textIndent: '0px',
}; // +/- buttons that appear on map can be styled here

export type MapMarker = {
  location: number[];
  title: string;
  imgSrc: string[];
  description: string[];
  tags: string[];
  color: string;
  chip?: any[];
};