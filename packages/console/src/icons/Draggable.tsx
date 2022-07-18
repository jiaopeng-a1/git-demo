import { SVGProps } from 'react';

const Draggable = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 10C6 10.8284 6.67157 11.5 7.5 11.5C8.32843 11.5 9 10.8284 9 10C9 9.17157 8.32843 8.5 7.5 8.5C6.67157 8.5 6 9.17157 6 10Z"
      fill="currentColor"
    />
    <path
      d="M6 5.5C6 6.32843 6.67157 7 7.5 7C8.32843 7 9 6.32843 9 5.5C9 4.67157 8.32843 4 7.5 4C6.67157 4 6 4.67157 6 5.5Z"
      fill="currentColor"
    />
    <path
      d="M6 14.5C6 15.3284 6.67157 16 7.5 16C8.32843 16 9 15.3284 9 14.5C9 13.6716 8.32843 13 7.5 13C6.67157 13 6 13.6716 6 14.5Z"
      fill="currentColor"
    />
    <path
      d="M11 10C11 10.8284 11.6716 11.5 12.5 11.5C13.3284 11.5 14 10.8284 14 10C14 9.17157 13.3284 8.5 12.5 8.5C11.6716 8.5 11 9.17157 11 10Z"
      fill="currentColor"
    />
    <path
      d="M11 5.5C11 6.32843 11.6716 7 12.5 7C13.3284 7 14 6.32843 14 5.5C14 4.67157 13.3284 4 12.5 4C11.6716 4 11 4.67157 11 5.5Z"
      fill="currentColor"
    />
    <path
      d="M11 14.5C11 15.3284 11.6716 16 12.5 16C13.3284 16 14 15.3284 14 14.5C14 13.6716 13.3284 13 12.5 13C11.6716 13 11 13.6716 11 14.5Z"
      fill="currentColor"
    />
  </svg>
);

export default Draggable;
