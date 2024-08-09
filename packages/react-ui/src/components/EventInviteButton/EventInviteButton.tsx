import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Button, Chip, Icon, IconButton, InputAdornment, TextField, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCUserContext, SCUserContextType, useSCFetchEvent} from '@selfcommunity/react-core';
import {ButtonProps} from '@mui/material/Button/Button';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import {LoadingButton} from '@mui/lab';
import {EventService} from '@selfcommunity/api-services';
import Autocomplete from '@mui/material/Autocomplete';
import {SCEventType, SCUserType} from '@selfcommunity/types';
import User from '../User';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import PubSub from 'pubsub-js';

const messages = defineMessages({
  placeholder: {
    id: 'ui.eventInviteButton.searchBar.placeholder',
    defaultMessage: 'ui.eventInviteButton.searchBar.placeholder'
  }
});

const PREFIX = 'SCEventInviteButton';

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

export interface EventInviteButtonProps extends ButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;

  /**
   * Id of the event
   * @default null
   */
  eventId?: number | string;

  /**
   * Functions to handle invitations sending in event creation mode
   * @default null
   */
  handleInvitations?: (data) => any;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Event Invite Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {SCEventInviteButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCEventInviteButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventInviteButton-root|Styles applied to the root element.|
 |dialogRoot|.SCEventInviteButton-dialog-root|Styles applied to the dialog root.|
 |dialogTitle|.SCEventInviteButton-dialog-title|Styles applied to the dialog title element.|
 |dialogContent|.SCEventInviteButton-dialog-content|Styles applied to the dialog content.|
 |autocomplete|.SCEventInviteButton-autocomplete|Styles applied to the autocomplete element.|
 |icon|.SCEventInviteButton-icon|Styles applied to the autocomplete icon element.|
 |input|.SCEventInviteButton-input|Styles applied to the autocomplete input element.|
 |clear|.SCEventInviteButton-clear|Styles applied to the autocomplete clear icon element.|
 |invitedBox|.SCEventInviteButton-invited-box|Styles applied to the invited users box.|
 |suggested|.SCEventInviteButton-suggested|Styles applied to the suggested users box.|

 * @param inProps
 */
export default function EventInviteButton(inProps: EventInviteButtonProps): JSX.Element {
  //PROPS
  const props: EventInviteButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, event, eventId, handleInvitations = null, ...rest} = props;

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

  /**
   * Notify UI when a member is invited to a event
   * @param event
   * @param usersInvited
   */
  function notifyChanges(event: SCEventType, usersInvited: SCUserType[]) {
    if (event && usersInvited) {
      PubSub.publish(`${SCTopicType.EVENT}.${SCGroupEventType.INVITE_MEMBER}`, usersInvited);
    }
  }

  function convertToInvitedUsersObject(data) {
    const invite_users = {};
    data.forEach((user, index) => {
      invite_users[`invite_users[${index}]`] = user.id;
    });
    return invite_users;
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

  // HOOKS
  const {scEvent} = useSCFetchEvent({id: eventId, event});

  const isEventAdmin = useMemo(
    () => scUserContext.user && scEvent?.managed_by?.id === scUserContext.user.id,
    [scUserContext.user, scEvent?.managed_by?.id]
  );

  // INTL
  const intl = useIntl();

  function fetchResults() {
    setLoading(true);
    EventService.getEventSuggestedUsers(scEvent?.id, value)
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
    EventService.getEventsSuggestedUsers(value)
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
    if (scEvent?.id) {
      EventService.getEventSuggestedUsers(scEvent?.id, value).then((data) => {
        setLoading(false);
        setList(data.results);
      });
    } else {
      EventService.getEventsSuggestedUsers(value).then((data) => {
        setLoading(false);
        setList(data.results);
      });
    }
  }, [scEvent?.id]);
  /**
   * If a value is entered in new message field, it fetches user suggested
   */
  useEffect(() => {
    if (scEvent) {
      fetchResults();
    } else {
      fetchGeneralResults();
    }
  }, [value, scEvent]);

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
      EventService.inviteOrAcceptEventRequest(scEvent.id, data)
        .then(() => {
          setIsSending(false);
          setOpen(false);
          setInvited([]);
          notifyChanges(scEvent, invited);
        })
        .catch((error) => {
          setOpen(false);
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

  const filterOptions = (options, {inputValue}) => {
    return options.filter((option) => {
      const usernameMatch = option.username.toLowerCase().includes(inputValue.toLowerCase());
      const nameMatch = option.real_name.toLowerCase().includes(inputValue.toLowerCase());
      return usernameMatch || nameMatch;
    });
  };

  /**
   * If in event edit mode and logged-in user is not also the event manager, the component is hidden.
  //  */
  if (event && !isEventAdmin) {
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
        variant={scEvent ? 'contained' : 'outlined'}
        color={scEvent ? 'secondary' : 'inherit'}
        startIcon={<Icon>add</Icon>}
        {...rest}>
        <FormattedMessage id="ui.eventInviteButton" defaultMessage="ui.eventInviteButton" />
      </Root>
      {open && (
        <DialogRoot
          DialogContentProps={{dividers: false}}
          open
          className={classes.dialogRoot}
          title={
            <>
              <IconButton onClick={handleClose}>
                <Icon>arrow_back</Icon>
              </IconButton>
              <Typography className={classes.dialogTitle}>
                <FormattedMessage id="ui.eventInviteButton.dialog.title" defaultMessage="ui.eventInviteButton.dialog.title" />
              </Typography>
              <LoadingButton
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleSendInvitations}
                loading={isSending}
                disabled={!invited.length}>
                <FormattedMessage id="ui.eventInviteButton.dialog.button.end" defaultMessage="ui.eventInviteButton.dialog.button.end" />
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
              filterOptions={filterOptions}
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
                  <FormattedMessage id="ui.eventInviteButton.dialog.content.list" defaultMessage="ui.eventInviteButton.dialog.content.list" />
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
