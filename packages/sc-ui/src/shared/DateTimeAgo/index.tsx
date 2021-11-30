import React from 'react';
import TimeAgo from 'react-timeago';
import itStrings from 'react-timeago/lib/language-strings/it';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';

const PREFIX = 'SCDateTimeAgo';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({
  width: 'auto',
  display: 'inline-block'
}));

const formatter = buildFormatter(itStrings);

export default function DateTimeAgo({live = true, date, ...rest}: {live?: boolean; date: Date; [p: string]: any;}): JSX.Element {
  if (date) {
    return (
      <Root {...rest}>
        <TimeAgo date={date} live={live} formatter={formatter} />
      </Root>
    );
  }
  return null;
}
