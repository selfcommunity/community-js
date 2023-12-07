import React from 'react';

/**
 * Overrides/extends single image type
 */
export interface DataType {
  key: number | string;
  src?: string;
  render?: (props) => React.ReactNode;
  overlay?: React.ReactNode;
  width?: number;
  height?: number;
  originRef?: React.MutableRefObject<HTMLElement | null>;
}
