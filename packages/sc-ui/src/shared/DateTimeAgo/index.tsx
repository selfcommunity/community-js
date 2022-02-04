import React from 'react';
import TimeAgo from 'react-timeago';
import itStrings from 'react-timeago/lib/language-strings/it';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {styled} from '@mui/material/styles';
import {Box, Tooltip, Typography} from '@mui/material';
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
  marginTop: 3,
  '& .MuiSvgIcon-root': {
    width: '0.6em',
    marginTop: -4
  }
}));

const formatter = buildFormatter(itStrings);

export interface DateTimeAgoProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Handles live option
   * @default true
   */
  live?: boolean;

  /**
   * Date obj
   * @default null
   */
  date: Date;

  /**
   * Handles icon showing
   * @default true
   */
  showStartIcon?: boolean;

  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function DateTimeAgo(props: DateTimeAgoProps): JSX.Element {
  // PROPS
  const {className, live = true, date = null, showStartIcon = true, ...rest} = props;

  // INTL
  const intl = useIntl();

  /**
   * Renders root object (if date obj)
   */

  if (date) {
    return (
      <Root className={className} {...rest}>
        {showStartIcon && <AccessTimeIcon sx={{paddingRight: '2px'}} />}
        <Tooltip title={`${intl.formatDate(date, {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'})}`}>
          <Typography variant={'body2'} component={'span'}>
            <TimeAgo date={date} live={live} formatter={formatter} />
          </Typography>
        </Tooltip>
      </Root>
    );
  }
  return null;
}
