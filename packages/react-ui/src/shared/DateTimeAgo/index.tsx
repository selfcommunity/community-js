import React, {useEffect} from 'react';
import {SCContextType, useSCContext} from '@selfcommunity/react-core';
import itStrings from 'react-timeago/lib/language-strings/it';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {styled} from '@mui/material/styles';
import {Box, Tooltip, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {useIntl} from 'react-intl';
import classNames from 'classnames';
import moment from 'moment';

const PREFIX = 'SCDateTimeAgo';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({
  width: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: 3,
  '& .MuiIcon-root': {
    fontSize: '18px',
    marginRight: 2
  },
  '& .MuiTypography-root': {
    lineHeight: 1.8
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
  const {className, date = null, showStartIcon = true, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();

  useEffect(() => {
    if (moment.locale() !== scContext.settings.locale.default) {
      moment.locale(scContext.settings.locale.default);
    }
  }, [scContext.settings.locale.default]);

  // INTL
  const intl = useIntl();

  /**
   * Renders root object (if date obj)
   */

  if (date) {
    return (
      <Root component="span" className={classNames(classes.root, className)} {...rest}>
        {showStartIcon && <Icon>access_time</Icon>}
        <Tooltip
          title={`${intl.formatDate(date, {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'})}`}
          enterTouchDelay={0}>
          <Typography variant={'body2'} component={'span'}>
            {moment(date).fromNow()}
          </Typography>
        </Tooltip>
      </Root>
    );
  }
  return null;
}
