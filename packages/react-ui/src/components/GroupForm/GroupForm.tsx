import React, {useState} from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Divider, FormGroup, Icon, Paper, Stack, Switch, TextField, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';
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
import {formatHttpErrorCode, GroupService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';

const messages = defineMessages({
  name: {
    id: 'ui.groupForm.name.placeholder',
    defaultMessage: 'ui.groupForm.name.placeholder'
  },
  description: {
    id: 'ui.groupForm.description.placeholder',
    defaultMessage: 'ui.groupForm.description.placeholder'
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
  inviteSection: `${PREFIX}-invite-section`,
  error: `${PREFIX}-error`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface GroupFormProps extends BaseDialogProps {
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
   * On success callback function
   * @default null
   */
  onSuccess?: (data: SCGroupType) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS  Group Form component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {GroupForm} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCGroupForm` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupForm-root|Styles applied to the root element.|
 |active|.SCGroupForm-active|Styles applied to the  active element.|
 |title|.SCGroupForm-title|Styles applied to the title element.|
 |header|.SCGroupForm-header|Styles applied to the header element.|
 |cover|.SCGroupForm-cover|Styles applied to the cover field.|
 |avatar|.SCGroupForm-avatar|Styles applied to the avatar field.|
 |form|.SCGroupForm-form|Styles applied to the form element.|
 |switch|.SCGroupForm-switch|Styles applied to the switch element.|
 |switchLabel|.SCGroupForm-switch-label|Styles applied to the switchLabel element.|
 |name|.SCGroupForm-name|Styles applied to the name field.|
 |description|.SCGroupForm-description|Styles applied to the description field.|
 |content|.SCGroupForm-content|Styles applied to the  element.|
 |privacySection|.SCGroupForm-privacy-section|Styles applied to the privacy section.|
 |privacySectionInfo|.SCGroupForm-privacy-section-info|Styles applied to the privacy info section.|
 |visibilitySection|.SCGroupForm-visibility-section|Styles applied to the visibility section.|
 |visibilitySectionInfo|.SCGroupForm-visibility-section-info|Styles applied to the visibility section info.|
 |inviteSection|.SCGroupForm-invite-section|Styles applied to the invite section.|
 |error|.SCGroupForm-error|Styles applied to the error elements.|

 * @param inProps
 */
export default function GroupForm(inProps: GroupFormProps): JSX.Element {
  //PROPS
  const props: GroupFormProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, open = true, onClose, onSuccess, group = null, ...rest} = props;

  const initialFieldState = {
    imageOriginal: group ? group.image_medium : '',
    imageOriginalFile: '',
    emotionalImageOriginal: group ? group.emotional_image : '',
    emotionalImageOriginalFile: '',
    name: group ? group.name : '',
    description: group ? group.description : '',
    isPublic: group && group.privacy === SCGroupPrivacyType.PUBLIC,
    isVisible: group ? group.visible : true,
    invitedUsers: null,
    isSubmitting: false
  };

  // STATE
  const [field, setField] = useState<any>(initialFieldState);
  const [error, setError] = useState<any>({});

  // INTL
  const intl = useIntl();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  const _backgroundCover = {
    ...(field.emotionalImageOriginal
      ? {background: `url('${field.emotionalImageOriginal}') center / cover`}
      : {background: `url('${scPreferences.preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}') center / cover`})
  };

  function handleChangeAvatar(avatar) {
    setField((prev: any) => ({...prev, ['imageOriginalFile']: avatar}));
    const reader = new FileReader();
    reader.onloadend = () => {
      setField((prev: any) => ({...prev, ['imageOriginal']: reader.result}));
    };
    reader.readAsDataURL(avatar);
    if (error.imageOriginalError) {
      delete error.imageOriginalError;
      setError(error);
    }
  }

  function handleChangeCover(cover) {
    setField((prev: any) => ({...prev, ['emotionalImageOriginalFile']: cover}));
    const reader = new FileReader();
    reader.onloadend = () => {
      setField((prev: any) => ({...prev, ['emotionalImageOriginal']: reader.result}));
    };
    reader.readAsDataURL(cover);
    if (error.emotionalImageOriginalError) {
      delete error.emotionalImageOriginalError;
      setError(error);
    }
  }

  const handleSubmit = () => {
    setField((prev: any) => ({...prev, ['isSubmitting']: true}));
    const formData: any = new FormData();
    formData.append('name', field.name);
    formData.append('description', field.description);
    formData.append('privacy', field.isPublic ? SCGroupPrivacyType.PUBLIC : SCGroupPrivacyType.PRIVATE);
    formData.append('visible', field.isVisible);
    if (field.imageOriginalFile) {
      formData.append('image_original', field.imageOriginalFile);
    }
    if (field.emotionalImageOriginalFile) {
      formData.append('emotional_image_original', field.emotionalImageOriginalFile);
    }
    for (const key in field.invitedUsers) {
      formData.append(key, field.invitedUsers[key]);
    }
    let groupService;
    if (group) {
      groupService = GroupService.updateGroup(group.id, formData, {headers: {'Content-Type': 'multipart/form-data'}});
    } else {
      groupService = GroupService.createGroup(formData, {headers: {'Content-Type': 'multipart/form-data'}});
    }
    groupService
      .then((data: SCGroupType) => {
        onSuccess && onSuccess(data);
        onClose && onClose();
        setField((prev: any) => ({...prev, ['isSubmitting']: false}));
      })
      .catch((e) => {
        setError({...error, ...formatHttpErrorCode(e)});
        setField((prev: any) => ({...prev, ['isSubmitting']: false}));
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const handleInviteSection = (data) => {
    setField((prev: any) => ({...prev, ['invitedUsers']: data}));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setField((prev: any) => ({...prev, [name]: value}));
    if (error[`${name}Error`]) {
      delete error[`${name}Error`];
      setError(error);
    }
  };

  /**
   * Renders root object
   */
  return (
    <Root
      DialogContentProps={{dividers: false}}
      title={
        group ? (
          <FormattedMessage id="ui.groupForm.title.edit" defaultMessage="ui.groupForm.title.edit" />
        ) : (
          <FormattedMessage id="ui.groupForm.title" defaultMessage="ui.groupForm.title" />
        )
      }
      open={open}
      onClose={onClose}
      className={classNames(classes.root, className)}
      actions={
        <LoadingButton
          loading={field.isSubmitting}
          disabled={!field.name || Object.keys(error).length !== 0}
          variant="contained"
          onClick={handleSubmit}
          color="secondary">
          {group ? (
            <FormattedMessage id="ui.groupForm.button.edit" defaultMessage="ui.groupForm.button.edit" />
          ) : (
            <FormattedMessage id="ui.groupForm.button.create" defaultMessage="ui.groupForm.button.create" />
          )}
        </LoadingButton>
      }
      {...rest}>
      <>
        <>
          <Paper style={_backgroundCover} classes={{root: classes.cover}}>
            <Box className={classes.avatar}>
              <Avatar>{field.imageOriginal ? <img src={field.imageOriginal} alt="avatar" /> : <Icon>icon_image</Icon>}</Avatar>
            </Box>
            <>
              <ChangeGroupPicture isCreationMode={true} onChange={handleChangeAvatar} />
              <ChangeGroupCover isCreationMode={true} onChange={handleChangeCover} />
            </>
          </Paper>
          <Typography
            className={classNames(classes.header, {[classes.error]: error.emotionalImageOriginalError || error.imageOriginalError})}
            align="center">
            {error.emotionalImageOriginalError || error.imageOriginalError ? (
              <FormattedMessage id="ui.groupForm.header.error" defaultMessage="ui.groupForm.header.error" />
            ) : (
              <FormattedMessage id="ui.groupForm.header" defaultMessage="ui.groupForm.header" />
            )}
          </Typography>
        </>
        <FormGroup className={classes.form}>
          <TextField
            required
            className={classes.name}
            placeholder={`${intl.formatMessage(messages.name)}`}
            margin="normal"
            value={field.name}
            name="name"
            onChange={handleChange}
            InputProps={{
              endAdornment: <Typography variant="body2">{GROUP_TITLE_MAX_LENGTH - field.name.length}</Typography>
            }}
          />
          <TextField
            multiline
            className={classes.description}
            placeholder={`${intl.formatMessage(messages.description)}`}
            margin="normal"
            value={field.description}
            name="description"
            onChange={handleChange}
            InputProps={{
              endAdornment: <Typography variant="body2">{GROUP_DESCRIPTION_MAX_LENGTH - field.description.length}</Typography>
            }}
          />
          <Box className={classes.privacySection}>
            <Typography variant="h4">
              <FormattedMessage
                id="ui.groupForm.privacy.title"
                defaultMessage="ui.groupForm.privacy.title"
                values={{b: (chunks) => <strong>{chunks}</strong>}}
              />
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography className={classNames(classes.switchLabel, {[classes.active]: !field.isPublic})}>
                <Icon>private</Icon>
                <FormattedMessage id="ui.groupForm.privacy.private" defaultMessage="ui.groupForm.privacy.private" />
              </Typography>
              <Switch
                className={classes.switch}
                checked={field.isPublic}
                onChange={() => setField((prev: any) => ({...prev, ['isPublic']: !field.isPublic}))}
                disabled={group && group.privacy === SCGroupPrivacyType.PRIVATE}
              />
              <Typography className={classNames(classes.switchLabel, {[classes.active]: field.isPublic})}>
                <Icon>public</Icon>
                <FormattedMessage id="ui.groupForm.privacy.public" defaultMessage="ui.groupForm.privacy.public" />
              </Typography>
            </Stack>
            <Typography variant="body2" className={classes.privacySectionInfo}>
              {field.isPublic ? (
                <FormattedMessage
                  id="ui.groupForm.privacy.public.info"
                  defaultMessage="ui.groupForm.privacy.public.info"
                  values={{b: (chunks) => <strong>{chunks}</strong>}}
                />
              ) : (
                <>
                  {group && group.privacy === SCGroupPrivacyType.PRIVATE ? (
                    <FormattedMessage
                      id="ui.groupForm.privacy.private.info.edit"
                      defaultMessage="ui.groupForm.private.public.info.edit"
                      values={{b: (chunks) => <strong>{chunks}</strong>}}
                    />
                  ) : (
                    <FormattedMessage
                      id="ui.groupForm.privacy.private.info"
                      defaultMessage="ui.groupForm.private.public.info"
                      values={{b: (chunks) => <strong>{chunks}</strong>}}
                    />
                  )}
                </>
              )}
            </Typography>
          </Box>
          <Box className={classes.visibilitySection}>
            {((!field.isPublic && !group) || (group && !field.isPublic)) && (
              <>
                <Typography variant="h4">
                  <FormattedMessage
                    id="ui.groupForm.visibility.title"
                    defaultMessage="ui.groupForm.visibility.title"
                    values={{b: (chunks) => <strong>{chunks}</strong>}}
                  />
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography className={classNames(classes.switchLabel, {[classes.active]: !field.isVisible})}>
                    <Icon>visibility_off</Icon>
                    <FormattedMessage id="ui.groupForm.visibility.hidden" defaultMessage="ui.groupForm.visibility.hidden" />
                  </Typography>
                  <Switch
                    className={classes.switch}
                    checked={field.isVisible}
                    onChange={() => setField((prev: any) => ({...prev, ['isVisible']: !field.isVisible}))}
                  />
                  <Typography className={classNames(classes.switchLabel, {[classes.active]: field.isVisible})}>
                    <Icon>visibility</Icon>
                    <FormattedMessage id="ui.groupForm.visibility.visible" defaultMessage="ui.groupForm.visibility.visible" />
                  </Typography>
                </Stack>
                <Typography variant="body2" className={classes.visibilitySectionInfo}>
                  {!field.isVisible ? (
                    <FormattedMessage
                      id="ui.groupForm.visibility.hidden.info"
                      defaultMessage="ui.groupForm.visibility.hidden.info"
                      values={{b: (chunks) => <strong>{chunks}</strong>}}
                    />
                  ) : (
                    <FormattedMessage
                      id="ui.groupForm.visibility.visible.info"
                      defaultMessage="ui.groupForm.visibility.visible.info"
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
