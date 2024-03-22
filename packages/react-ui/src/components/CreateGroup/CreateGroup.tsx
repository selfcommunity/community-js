import React, {useContext, useMemo, useState} from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Divider, FormGroup, Icon, Paper, Stack, Switch, TextField, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCPreferences, SCPreferencesContextType, SCUserContext, SCUserContextType, useSCPreferences} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {PREFIX} from './constants';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {LoadingButton} from '@mui/lab';
import ChangeGroupPicture from '../ChangeGroupPicture';
import ChangeGroupCover from '../ChangeGroupCover';
import {GROUP_DESCRIPTION_MAX_LENGTH, GROUP_TITLE_MAX_LENGTH} from '../../constants/Group';
import GroupInviteButton from '../GroupInviteButton';
import {SCGroupPrivacyType, SCGroupType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {GroupService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';

const messages = defineMessages({
  name: {
    id: 'ui.createGroup.name.placeholder',
    defaultMessage: 'ui.createGroup.name.placeholder'
  },
  description: {
    id: 'ui.createGroup.description.placeholder',
    defaultMessage: 'ui.createGroup.description.placeholder'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  active: `${PREFIX}-active`,
  title: `${PREFIX}-title`,
  header: `${PREFIX}-header`,
  cover: `${PREFIX}-cover`,
  avatar: `${PREFIX}-avatar`,
  form: `${PREFIX}-form`,
  switch: `${PREFIX}-switch`,
  switchLabel: `${PREFIX}-switch-label`,
  name: `${PREFIX}-name`,
  description: `${PREFIX}-description`,
  content: `${PREFIX}-content`,
  privacySection: `${PREFIX}-privacy-section`,
  privacySectionInfo: `${PREFIX}-privacy-section-info`,
  visibilitySection: `${PREFIX}-visibility-section`,
  visibilitySectionInfo: `${PREFIX}-visibility-section-info`,
  inviteSection: `${PREFIX}-invite-section`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface CreateGroupProps extends BaseDialogProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Open dialog
   * @default true
   */
  open?: boolean;
  /**
   * On dialog close callback function
   * @default null
   */
  onClose?: () => void;

  /**
   * Group Object
   * @default null
   */
  group?: SCGroupType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Create Group Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CreateGroupButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCreateGroup` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCreateGroup-root|Styles applied to the root element.|

 * @param inProps
 */
export default function CreateGroup(inProps: CreateGroupProps): JSX.Element {
  //PROPS
  const props: CreateGroupProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, open = true, onClose, group, ...rest} = props;

  // TODO: fare initial state con tutti i fields per la gestione dell'edit

  // STATE
  const [avatar, setAvatar] = useState<string | any>('');
  const [cover, setCover] = useState<string | any>('');
  const [name, setName] = useState<string>('');
  const [invitedUsers, setInvitedUsers] = useState<any>(null);
  const [description, setDescription] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // INTL
  const intl = useIntl();

  // CONTEXT
  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  const _backgroundCover = {
    ...(cover
      ? {background: `url('${cover}') center / cover`}
      : {background: `url('${scPreferences.preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}') center / cover`})
  };

  function handleChangeAvatar(avatar) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(avatar);
  }

  function handleChangeCover(cover) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCover(reader.result);
    };
    reader.readAsDataURL(cover);
  }

  const handleSubmit = () => {
    setIsSubmitting(true);
    const formData: any = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('privacy', isPublic ? SCGroupPrivacyType.PUBLIC : SCGroupPrivacyType.PRIVATE);
    formData.append('image_original', avatar);
    formData.append('emotional_image_original', cover);
    formData.append('visible', isVisible);
    for (const key in invitedUsers) {
      formData.append(key, invitedUsers[key]);
    }
    GroupService.createGroup(formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then((data: SCGroupType) => {
        console.log(data);
        setIsSubmitting(false);
      })
      .catch((error) => {
        setIsSubmitting(false);
        Logger.error(SCOPE_SC_UI, error);
      });
  };

  const handleInviteSection = (data) => {
    setInvitedUsers(data);
  };

  /**
   * Renders root object
   */
  return (
    <Root
      DialogContentProps={{dividers: false}}
      title={
        group ? (
          <FormattedMessage id="ui.createGroup.title.edit" defaultMessage="ui.createGroup.title.edit" />
        ) : (
          <FormattedMessage id="ui.createGroup.title" defaultMessage="ui.createGroup.title" />
        )
      }
      open={open}
      onClose={onClose}
      className={classNames(classes.root, className)}
      actions={
        <LoadingButton loading={isSubmitting} disabled={!name} variant="contained" onClick={handleSubmit} color="secondary">
          {group ? (
            <FormattedMessage id="ui.createGroup.button.edit" defaultMessage="ui.createGroup.button.edit" />
          ) : (
            <FormattedMessage id="ui.createGroup.button.create" defaultMessage="ui.createGroup.button.create" />
          )}
        </LoadingButton>
      }
      {...rest}>
      <>
        <>
          <Paper style={_backgroundCover} classes={{root: classes.cover}}>
            <Box className={classes.avatar}>
              <Avatar>{avatar ? <img src={avatar} alt="avatar" /> : <Icon>icon_image</Icon>}</Avatar>
            </Box>
            <>
              <ChangeGroupPicture isCreationMode={true} onChange={handleChangeAvatar} />
              <ChangeGroupCover isCreationMode={true} onChange={handleChangeCover} />
            </>
          </Paper>
          <Typography className={classes.header} align="center">
            <FormattedMessage id="ui.createGroup.header" defaultMessage="ui.createGroup.header" />
          </Typography>
        </>
        <FormGroup className={classes.form}>
          <TextField
            required
            className={classes.name}
            placeholder={`${intl.formatMessage(messages.name)}`}
            margin="normal"
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
            InputProps={{
              endAdornment: <Typography variant="body2">{GROUP_TITLE_MAX_LENGTH - name.length}</Typography>
            }}
          />
          <TextField
            multiline
            className={classes.description}
            placeholder={`${intl.formatMessage(messages.description)}`}
            margin="normal"
            value={description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}
            InputProps={{
              endAdornment: <Typography variant="body2">{GROUP_DESCRIPTION_MAX_LENGTH - description.length}</Typography>
            }}
          />
          <Box className={classes.privacySection}>
            <Typography variant="h4">
              <FormattedMessage
                id="ui.createGroup.privacy.title"
                defaultMessage="ui.createGroup.privacy.title"
                values={{b: (chunks) => <strong>{chunks}</strong>}}
              />
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography className={classNames(classes.switchLabel, {[classes.active]: !isPublic})}>
                <Icon>private</Icon>
                <FormattedMessage id="ui.createGroup.privacy.private" defaultMessage="ui.createGroup.privacy.private" />
              </Typography>
              <Switch className={classes.switch} checked={isPublic} onClick={() => setIsPublic(!isPublic)} />
              <Typography className={classNames(classes.switchLabel, {[classes.active]: isPublic})}>
                <Icon>public</Icon>
                <FormattedMessage id="ui.createGroup.privacy.public" defaultMessage="ui.createGroup.privacy.public" />
              </Typography>
            </Stack>
            <Typography variant="body2" className={classes.privacySectionInfo}>
              {isPublic ? (
                <FormattedMessage
                  id="ui.createGroup.privacy.public.info"
                  defaultMessage="ui.createGroup.privacy.public.info"
                  values={{b: (chunks) => <strong>{chunks}</strong>}}
                />
              ) : (
                <FormattedMessage
                  id="ui.createGroup.privacy.private.info"
                  defaultMessage="ui.createGroup.private.public.info"
                  values={{b: (chunks) => <strong>{chunks}</strong>}}
                />
              )}
            </Typography>
          </Box>
          <Box className={classes.visibilitySection}>
            {!isPublic && (
              <>
                <Typography variant="h4">
                  <FormattedMessage
                    id="ui.createGroup.visibility.title"
                    defaultMessage="ui.createGroup.visibility.title"
                    values={{b: (chunks) => <strong>{chunks}</strong>}}
                  />
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography className={classNames(classes.switchLabel, {[classes.active]: !isVisible})}>
                    <Icon>visibility_off</Icon>
                    <FormattedMessage id="ui.createGroup.visibility.hidden" defaultMessage="ui.createGroup.visibility.hidden" />
                  </Typography>
                  <Switch className={classes.switch} checked={isVisible} onClick={() => setIsVisible(!isVisible)} />
                  <Typography className={classNames(classes.switchLabel, {[classes.active]: isVisible})}>
                    <Icon>visibility</Icon>
                    <FormattedMessage id="ui.createGroup.visibility.visible" defaultMessage="ui.createGroup.visibility.visible" />
                  </Typography>
                </Stack>
                <Typography variant="body2" className={classes.visibilitySectionInfo}>
                  {!isVisible ? (
                    <FormattedMessage
                      id="ui.createGroup.visibility.hidden.info"
                      defaultMessage="ui.createGroup.visibility.hidden.info"
                      values={{b: (chunks) => <strong>{chunks}</strong>}}
                    />
                  ) : (
                    <FormattedMessage
                      id="ui.createGroup.visibility.visible.info"
                      defaultMessage="ui.createGroup.visibility.visible.info"
                      values={{b: (chunks) => <strong>{chunks}</strong>}}
                    />
                  )}
                </Typography>
              </>
            )}
          </Box>
        </FormGroup>
        <Divider />
        <Box className={classes.inviteSection}>
          <GroupInviteButton handleInvitations={handleInviteSection} />
        </Box>
      </>
    </Root>
  );
}
