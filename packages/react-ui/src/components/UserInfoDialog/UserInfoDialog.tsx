import {Avatar, Box, styled, Typography} from '@mui/material';
import React from 'react';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import UserInfo, { UserInfoProps, UserInfoSkeleton } from '../UserInfo';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {SCUserType} from '@selfcommunity/types/src/types';
import {useSCFetchUser} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCUserInfoDialog';

const classes = {
  root: `${PREFIX}-root`,
  caption: `${PREFIX}-caption`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface UserInfoDialogProps extends Pick<BaseDialogProps, Exclude<keyof BaseDialogProps, 'title' | 'subtitle'>> {
  /**
   * Id of user object
   * @default null
   */
  userId?: number;

  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  UserInfoProps?: UserInfoProps;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function UserInfoDialog(inProps: UserInfoDialogProps) {
  // PROPS
  const props: UserInfoDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, userId = null, user = null, UserInfoProps = {}, ...rest} = props;

  // HOOKS
  const {scUser} = useSCFetchUser({id: userId, user});

  // RENDER
  const subtitle = (
    <Box className={classes.caption}>
      <Avatar className={classes.avatar} src={scUser?.avatar}></Avatar>
      <Typography className={classes.username} variant="h6">
        {scUser?.real_name ? scUser?.real_name : scUser?.username}
      </Typography>
    </Box>
  );

  return (
    <Root
      title={<FormattedMessage id="ui.userInfoDialog.title" defaultMessage="ui.userInfoDialog.title" />}
      subtitle={subtitle}
      className={classNames(classes.root, className)}
      {...rest}>
      {scUser ? <UserInfo {...UserInfoProps} userId={userId} user={scUser} /> : <UserInfoSkeleton />}
    </Root>
  );
}
