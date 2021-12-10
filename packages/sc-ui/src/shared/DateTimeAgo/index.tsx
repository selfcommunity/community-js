import React from 'react';
import TimeAgo from 'react-timeago';
import itStrings from 'react-timeago/lib/language-strings/it';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {styled} from '@mui/material/styles';
import {Box, Tooltip} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {useIntl} from 'react-intl';

const PREFIX = 'SCDateTimeAgo';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({
  width: 'auto',
  display: 'flex',
  '& .MuiSvgIcon-root': {
    width: '0.6em',
    marginTop: -4
  }
}));

const formatter = buildFormatter(itStrings);

export default function DateTimeAgo({
  live = true,
  date = null,
  showStartIcon = true,
  ...rest
}: {
  live?: boolean;
  date: Date;
  showStartIcon?: boolean;
  [p: string]: any;
}): JSX.Element {
  const intl = useIntl();
  if (date) {
    return (
      <Root {...rest}>
        {showStartIcon && <AccessTimeIcon sx={{paddingRight: '2px'}} />}
        <Tooltip title={`${intl.formatDate(date, {year: 'numeric', month: 'numeric', day: 'numeric'})}`}>
          <TimeAgo date={date} live={live} formatter={formatter} />
        </Tooltip>
      </Root>
    );
  }
  return null;
}
