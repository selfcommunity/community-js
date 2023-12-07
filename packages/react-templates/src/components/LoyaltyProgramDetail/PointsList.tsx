import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';
import {Divider, Grid, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';

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
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-points-list-root`,
  element: `${PREFIX}-element`
};

export function PointElement({message, points}: {message: React.ReactNode; points: number}): JSX.Element {
  return (
    <Grid item xs={12} sm={12} md={6}>
      <Typography component={'div'} className={classes.element}>
        <Typography>{message}</Typography>
        <Typography>
          +
          <FormattedMessage
            id="templates.loyaltyProgramDetail.points"
            defaultMessage="templates.loyaltyProgramDetail.points"
            values={{total: points}}
          />
        </Typography>
      </Typography>
      <Divider />
    </Grid>
  );
}

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'PointsListRoot'
})(() => ({}));

export interface PointsListProps {
  className?: string;
}

/**
 *
 * @constructor
 * @param props
 */
export default function PointsList(props: PointsListProps): JSX.Element {
  // PROPS
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
        message={<FormattedMessage id="templates.loyaltyProgramDetail.points.post" defaultMessage="templates.loyaltyProgramDetail.points.post" />}
        points={preferences[SCPreferences.POINTS_MAKE_POST]}
      />
      <PointElement
        message={
          <FormattedMessage id="templates.loyaltyProgramDetail.points.discussion" defaultMessage="templates.loyaltyProgramDetail.points.discussion" />
        }
        points={preferences[SCPreferences.POINTS_MAKE_DISCUSSION]}
      />
      <PointElement
        message={
          <FormattedMessage id="templates.loyaltyProgramDetail.points.comment" defaultMessage="templates.loyaltyProgramDetail.points.comment" />
        }
        points={preferences[SCPreferences.POINTS_MAKE_COMMENT]}
      />
      <PointElement
        message={
          <FormattedMessage
            id="templates.loyaltyProgramDetail.points.appreciation"
            defaultMessage="templates.loyaltyProgramDetail.points.appreciation"
          />
        }
        points={preferences[SCPreferences.POINTS_RECEIVE_VOTE]}
      />
      <PointElement
        message={
          <FormattedMessage id="templates.loyaltyProgramDetail.points.follower" defaultMessage="templates.loyaltyProgramDetail.points.follower" />
        }
        points={preferences[SCPreferences.POINTS_CONNECTION_OR_FOLLOWER]}
      />
      <PointElement
        message={<FormattedMessage id="templates.loyaltyProgramDetail.points.share" defaultMessage="templates.loyaltyProgramDetail.points.share" />}
        points={preferences[SCPreferences.POINTS_SOCIAL_SHARE]}
      />
      <PointElement
        message={<FormattedMessage id="templates.loyaltyProgramDetail.points.app" defaultMessage="templates.loyaltyProgramDetail.points.app" />}
        points={preferences[SCPreferences.POINTS_APP_USED]}
      />
      <PointElement
        message={<FormattedMessage id="templates.loyaltyProgramDetail.points.visit" defaultMessage="templates.loyaltyProgramDetail.points.visit" />}
        points={preferences[SCPreferences.POINTS_DAILY_VISIT]}
      />
    </Root>
  );
}
