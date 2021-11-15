import React from 'react';
import TimeAgo from 'react-timeago';
import itStrings from 'react-timeago/lib/language-strings/it';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCDateTimeAgo';

const Root = styled('span', {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})();

const formatter = buildFormatter(itStrings);

export default function DateTimeAgo({live = true, date}: {live?: boolean; date: Date}): JSX.Element {
  if (date) {
    return <TimeAgo date={date} live={live} formatter={formatter} />;
  }
  return null;
}
