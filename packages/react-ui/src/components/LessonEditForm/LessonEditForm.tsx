import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Box, Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from '@mui/material';
import {PREFIX} from './constants';
import {FormattedMessage} from 'react-intl';
import {SCCourseLessonStatusType} from '@selfcommunity/types';

const classes = {
  root: `${PREFIX}-root`,
  settings: `${PREFIX}-settings`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

export interface LessonEditFormProps {
  /**
   * Callback fired when settings change
   */
  onSettingsChange?: (settings: any) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function LessonEditForm(inProps: LessonEditFormProps): JSX.Element {
  // PROPS
  const props: LessonEditFormProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, onSettingsChange, ...rest} = props;

  //STATE
  const [settings, setSettings] = useState({comments_enabled: false, status: SCCourseLessonStatusType.DRAFT});

  // HANDLERS

  const handleChange = (field, value) => {
    const updatedSettings = {...settings, [field]: value};
    setSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  /**
   * Rendering
   */

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      <FormControl>
        <FormLabel id="status">
          <FormattedMessage id="ui.lessonEditForm.status.title" defaultMessage="ui.lessonEditForm.status.title" />
        </FormLabel>
        <RadioGroup
          aria-labelledby="course-status-radio-buttons-group"
          name="course-status-radio-buttons-group"
          value={settings.status}
          onChange={(e) => handleChange('status', e.target.value)}>
          <FormControlLabel
            value={SCCourseLessonStatusType.DRAFT}
            control={<Radio />}
            label={<FormattedMessage id="ui.lessonEditForm.status.draft" defaultMessage="ui.lessonEditForm.status.draft" />}
          />
          <FormControlLabel
            value={SCCourseLessonStatusType.PUBLISHED}
            control={<Radio />}
            label={<FormattedMessage id="ui.lessonEditForm.status.published" defaultMessage="ui.lessonEditForm.status.published" />}
          />
        </RadioGroup>
      </FormControl>
      <FormControl className={classes.settings}>
        <FormLabel id="settings">
          <FormattedMessage id="ui.lessonEditForm.settings.title" defaultMessage="ui.lessonEditForm.settings.title" />
        </FormLabel>
        <FormControlLabel
          control={<Checkbox checked={settings.comments_enabled} onChange={(e) => handleChange('comments_enabled', e.target.checked)} />}
          label={<FormattedMessage id="ui.lessonEditForm.settings.enableComments" defaultMessage="ui.lessonEditForm.settings.enableComments" />}
        />
      </FormControl>
    </Root>
  );
}
