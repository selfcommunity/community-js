import React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';

const PREFIX = 'SCPollObject';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  background: theme.palette.grey['A100'],
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1)
}));

export interface PollObjectProps {
  /**
   * If `false`, the poll is not votable
   * @default false
   */
  votable?: boolean;
  /**
   * callback to sync poll obj of the feedObject
   * @param value
   */
  onChange?: (value: any) => void;
  /**
   * Any othe properties
   */
  [p: string]: any;
}

export default function PollObject({pollObject = null, votable = true, ...rest}: PollObjectProps): JSX.Element {
  /**
   * Render the poll object
   */
  let objElement = <></>;
  if (pollObject) {
    objElement = <>{pollObject.title}</>;
  }

  /**
   * Render root element
   */
  return <Root {...rest}>{objElement}</Root>;
}
