import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';
import {Divider, Grid, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';

const PREFERENCES = [
  SCPreferences.POINTS_MAKE_DISCUSSION,
  SCPreferences.POINTS_MAKE_POST,
  SCPreferences.POINTS_MAKE_COMMENT,
  SCPreferences.POINTS_RECEIVE_VOTE,
  SCPreferences.POINTS_CONNECTION_OR_FOLLOWER,
  SCPreferences.POINTS_SOCIAL_SHARE,
  SCPreferences.POINTS_APP_USED,
  SCPreferences.POINTS_DAILY_VISIT
];
const PREFIX = 'SCLoyaltyProgramDetailPointsList';

const classes = {
  root: `${PREFIX}-root`,
  element: `${PREFIX}-element`
};

export function PointElement({message, points, name}: {message: React.ReactNode; points: number; name: string}): JSX.Element {
  return (
    <Grid item xs={12} sm={12} md={6} key={name}>
      <Typography component={'div'} className={classes.element}>
        <Typography>{message}</Typography>
        <Typography>
          +<FormattedMessage id="ui.loyaltyProgramDetail.points" defaultMessage="ui.loyaltyProgramDetail.points" values={{total: points}} />
        </Typography>
      </Typography>
      <Divider />
    </Grid>
  );
}

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PointsListProps {
  className?: string;
}

/**
 *
 * @param inProps
 * @constructor
 */
export default function PointsList(inProps: PointsListProps): JSX.Element {
  // PROPS
  const props: PointsListProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, ...rest} = props;

  // CONTEXT
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  /**
   * Renders the component (if not hidden by autoHide prop)
   */

  return (
    <Root className={classNames(classes.root, className)} container spacing={2} {...rest}>
      <PointElement
        message={<FormattedMessage id="ui.loyaltyProgramDetail.points.post" defaultMessage="ui.loyaltyProgramDetail.points.post" />}
        points={preferences[SCPreferences.POINTS_MAKE_POST]}
        name={SCPreferences.POINTS_MAKE_POST}
      />
      <PointElement
        message={<FormattedMessage id="ui.loyaltyProgramDetail.points.discussion" defaultMessage="ui.loyaltyProgramDetail.points.discussion" />}
        points={preferences[SCPreferences.POINTS_MAKE_DISCUSSION]}
        name={SCPreferences.POINTS_MAKE_DISCUSSION}
      />
      <PointElement
        message={<FormattedMessage id="ui.loyaltyProgramDetail.points.comment" defaultMessage="ui.loyaltyProgramDetail.points.comment" />}
        points={preferences[SCPreferences.POINTS_MAKE_COMMENT]}
        name={SCPreferences.POINTS_MAKE_COMMENT}
      />
      <PointElement
        message={<FormattedMessage id="ui.loyaltyProgramDetail.points.appreciation" defaultMessage="ui.loyaltyProgramDetail.points.appreciation" />}
        points={preferences[SCPreferences.POINTS_RECEIVE_VOTE]}
        name={SCPreferences.POINTS_RECEIVE_VOTE}
      />
      <PointElement
        message={<FormattedMessage id="ui.loyaltyProgramDetail.points.follower" defaultMessage="ui.loyaltyProgramDetail.points.follower" />}
        points={preferences[SCPreferences.POINTS_CONNECTION_OR_FOLLOWER]}
        name={SCPreferences.POINTS_CONNECTION_OR_FOLLOWER}
      />
      <PointElement
        message={<FormattedMessage id="ui.loyaltyProgramDetail.points.share" defaultMessage="ui.loyaltyProgramDetail.points.share" />}
        points={preferences[SCPreferences.POINTS_SOCIAL_SHARE]}
        name={SCPreferences.POINTS_SOCIAL_SHARE}
      />
      <PointElement
        message={<FormattedMessage id="ui.loyaltyProgramDetail.points.app" defaultMessage="ui.loyaltyProgramDetail.points.app" />}
        points={preferences[SCPreferences.POINTS_APP_USED]}
        name={SCPreferences.POINTS_APP_USED}
      />
      <PointElement
        message={<FormattedMessage id="ui.loyaltyProgramDetail.points.visit" defaultMessage="ui.loyaltyProgramDetail.points.visit" />}
        points={preferences[SCPreferences.POINTS_DAILY_VISIT]}
        name={SCPreferences.POINTS_DAILY_VISIT}
      />
    </Root>
  );
}
