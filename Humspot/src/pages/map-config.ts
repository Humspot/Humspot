
export const zoomControlButtonsStyleDark = {
  width: "50px",
  height: '50px',
  borderRadius: '5px',
  boxShadow: '0 1px 4px -1px rgba(0,0,0,.3)',
  background: '#0D1117',
  lineHeight: '50px',
  fontSize: '25PX',
  fontWeight: '500',
  color: 'WHITE',
  cursor: 'pointer',
  border: 'none',
  display: 'block',
  outline: 'none',
  textIndent: '0px',
} // +/- buttons that appear on map can be styled here

export const zoomControlButtonsStyle = {
  width: "50px",
  height: '50px',
  borderRadius: '7.5px',
  boxShadow: '0 1px 4px -1px rgba(0,0,0,.3)',
  background: 'white',
  lineHeight: '26px',
  fontSize: '25PX',
  fontWeight: '500',
  color: 'BLACK',
  cursor: 'pointer',
  border: 'none',
  display: 'block',
  outline: 'none',
  textIndent: '0px',
}; // +/- buttons that appear on map can be styled here

export type MapMarker = {
  location: number[];
  title: string;
  imgSrc: string[];
  description: string[];
  tag: string;
  color: string;
  chip?: any[];
};