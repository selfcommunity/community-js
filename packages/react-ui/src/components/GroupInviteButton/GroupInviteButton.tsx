import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Button, Chip, Icon, IconButton, InputAdornment, TextField, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCUserContext, SCUserContextType, useSCFetchGroup} from '@selfcommunity/react-core';
import {ButtonProps} from '@mui/material/Button/Button';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import {LoadingButton} from '@mui/lab';
import {GroupService} from '@selfcommunity/api-services';
import Autocomplete from '@mui/material/Autocomplete';
import {SCGroupType, SCUserType} from '@selfcommunity/types';
import User from '../User';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';

const messages = defineMessages({
  placeholder: {
    id: 'ui.groupInviteButton.searchBar.placeholder',
    defaultMessage: 'ui.groupInviteButton.searchBar.placeholder'
  }
});

const PREFIX = 'SCGroupInviteButton';

const classes = {
  root: `${PREFIX}-root`,
  dialogRoot: `${PREFIX}-dialog-root`,
  dialogTitle: `${PREFIX}-dialog-title`,
  dialogContent: `${PREFIX}-dialog-content`,
  autocomplete: `${PREFIX}-autocomplete`,
  icon: `${PREFIX}-icon`,
  input: `${PREFIX}-input`,
  clear: `${PREFIX}-clear`,
  invitedBox: `${PREFIX}-invited-box`,
  suggested: `${PREFIX}-suggested`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(({theme}) => ({}));

export interface GroupInviteButtonProps extends ButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Group Object
   * @default null
   */
  group?: SCGroupType;

  /**
   * Id of the group
   * @default null
   */
  groupId?: number | string;

  /**
   * Functions to handle invitations sending in group creation mode
   * @default null
   */
  handleInvitations?: (data) => any;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Group Invite Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {SCGroupInviteButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCGroupInviteButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupInviteButton-root|Styles applied to the root element.|
 |dialogRoot|.SCGroupInviteButton-dialog-root|Styles applied to the dialog root.|
 |dialogTitle|.SCGroupInviteButton-dialog-title|Styles applied to the dialog title element.|
 |dialogContent|.SCGroupInviteButton-dialog-content|Styles applied to the dialog content.|
 |autocomplete|.SCGroupInviteButton-autocomplete|Styles applied to the autocomplete element.|
 |icon|.SCGroupInviteButton-icon|Styles applied to the autocomplete icon element.|
 |input|.SCGroupInviteButton-input|Styles applied to the autocomplete input element.|
 |clear|.SCGroupInviteButton-clear|Styles applied to the autocomplete clear icon element.|
 |invitedBox|.SCGroupInviteButton-invited-box|Styles applied to the invited users box.|
 |suggested|.SCGroupInviteButton-suggested|Styles applied to the suggested users box.|

 * @param inProps
 */
export default function GroupInviteButton(inProps: GroupInviteButtonProps): JSX.Element {
  //PROPS
  const props: GroupInviteButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, group, groupId, handleInvitations = null, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [open, setOpen] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [suggested, setSuggested] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [invited, setInvited] = useState<any>([]);

  function convertToInvitedUsersObject(data) {
    const invited_users = {};
    data.forEach((user, index) => {
      invited_users[`invited_users[${index}]`] = user.id;
    });
    return invited_users;
  }

  /**
   * Memoized users invited ids
   */
  const ids = useMemo(() => {
    if (invited) {
      return invited.map((u) => {
        return parseInt(u.id, 10);
      });
    }
    return [invited];
  }, [invited]);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // HOOKS
  const {scGroup} = useSCFetchGroup({id: groupId, group});

  // INTL
  const intl = useIntl();

  function fetchResults() {
    setLoading(true);
    GroupService.getGroupSuggestedUsers(scGroup?.id, value)
      .then((data) => {
        setLoading(false);
        setSuggested(data.results);
      })
      .catch((error) => {
        setLoading(false);
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  function fetchGeneralResults() {
    setLoading(true);
    GroupService.getGroupsSuggestedUsers(value)
      .then((data) => {
        setLoading(false);
        setSuggested(data.results);
      })
      .catch((error) => {
        setLoading(false);
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  useEffect(() => {
    if (scGroup?.id) {
      GroupService.getGroupSuggestedUsers(scGroup?.id, value).then((data) => {
        setLoading(false);
        setList(data.results);
      });
    } else {
      GroupService.getGroupsSuggestedUsers(value).then((data) => {
        setLoading(false);
        setList(data.results);
      });
    }
  }, [scGroup?.id]);
  /**
   * If a value is entered in new message field, it fetches user suggested
   */
  useEffect(() => {
    if (value && !handleInvitations) {
      fetchResults();
    }
    fetchGeneralResults();
  }, [value, handleInvitations]);

  /**
   * Handles dialog close
   */
  const handleClose = () => {
    setOpen((p) => !p);
  };

  /**
   * Handles invitation sending
   */
  const handleSendInvitations = () => {
    if (handleInvitations) {
      handleInvitations(convertToInvitedUsersObject(invited));
      setOpen(false);
    } else {
      const data = {users: ids};
      setIsSending(true);
      GroupService.inviteOrAcceptGroupRequest(scGroup.id, data)
        .then(() => {
          setIsSending(false);
        })
        .catch((error) => {
          setLoading(false);
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  };

  // Autocomplete Handlers

  const handleInputChange = (event, value, reason) => {
    switch (reason) {
      case 'input':
        setValue(value);
        !value && setSuggested([]);
        break;
      case 'reset':
        setValue(value);
        break;
    }
  };

  const handleChange = (event, value, reason, details) => {
    event.preventDefault();
    event.stopPropagation();
    switch (reason) {
      case 'selectOption':
        setInvited(value);
        setList((prev) => prev.filter((u) => u.id !== details.option.id));
        break;
      case 'removeOption':
        setInvited(value);
        setList((prev) => [...prev, details.option]);
        break;
    }
    return false;
  };

  const handleUserInvite = (user) => {
    setInvited((prev) => [...prev, user]);
    setList((prev) => prev.filter((u) => u.id !== user.id));
  };

  const handleDelete = (option) => {
    setInvited(invited.filter((v) => v !== option));
    setList((prev) => [...prev, option]);
  };

  /**
   * If there's no authUserId, component is hidden.
  //  */
  if (!authUserId) {
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <React.Fragment>
      <Root
        className={classNames(classes.root, className)}
        onClick={handleClose}
        size="small"
        variant="outlined"
        startIcon={<Icon fontSize="small">add</Icon>}
        {...rest}>
        <FormattedMessage id="ui.groupInviteButton" defaultMessage="ui.groupInviteButton" />
      </Root>
      {open && (
        <DialogRoot
          DialogContentProps={{dividers: false}}
          open
          className={classes.dialogRoot}
          title={
            <>
              <IconButton onClick={handleClose}>
                <Icon fontSize="medium">arrow_back</Icon>
              </IconButton>
              <Typography className={classes.dialogTitle}>
                <FormattedMessage id="ui.groupInviteButton.dialog.title" defaultMessage="ui.groupInviteButton.dialog.title" />
              </Typography>
              <LoadingButton size="small" color="secondary" variant="contained" onClick={handleSendInvitations} loading={isSending}>
                <FormattedMessage id="ui.groupInviteButton.dialog.button.end" defaultMessage="ui.groupInviteButton.dialog.button.end" />
              </LoadingButton>
            </>
          }>
          <Box className={classes.dialogContent}>
            <Autocomplete
              className={classes.autocomplete}
              loading={loading}
              size="small"
              multiple
              freeSolo
              disableClearable
              options={suggested}
              onChange={handleChange}
              onInputChange={handleInputChange}
              inputValue={value}
              value={invited}
              getOptionLabel={(option) => (option ? option.username : '...')}
              isOptionEqualToValue={(option, value) => (option ? value.id === option.id : false)}
              renderTags={() => null}
              renderOption={(props, option: SCUserType) => (
                <Box component="li" {...props}>
                  <Avatar alt={option.username} src={option.avatar} />
                  <Typography ml={1}>{option.username}</Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder={`${intl.formatMessage(messages.placeholder)}`}
                  InputProps={{
                    ...params.InputProps,
                    className: classes.input,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <Icon className={classes.icon}>search</Icon>
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
            <Box className={classes.invitedBox}>
              {invited.map((option, index) => (
                <Chip
                  key={index}
                  avatar={<Avatar alt={option.username} src={option.avatar} />}
                  label={option.username}
                  onDelete={() => {
                    handleDelete(option);
                  }}
                  style={{marginRight: 8}}
                />
              ))}
            </Box>
            <Box className={classes.suggested}>
              {list.length !== 0 && (
                <Typography variant="h4" fontWeight="bold">
                  <FormattedMessage id="ui.groupInviteButton.dialog.content.list" defaultMessage="ui.groupInviteButton.dialog.content.list" />
                </Typography>
              )}
              {list.slice(0, 5).map((user: SCUserType, index) => (
                <User elevation={0} actions={<></>} user={user} userId={user.id} key={index} buttonProps={{onClick: () => handleUserInvite(user)}} />
              ))}
            </Box>
          </Box>
        </DialogRoot>
      )}
    </React.Fragment>
  );
}
