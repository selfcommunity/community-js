import {Box, BoxProps, FormControl, FormControlLabel, FormHelperText, FormLabel, Icon, Radio, RadioGroup, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {EventService, formatHttpErrorCode} from '@selfcommunity/api-services';
import {SCContextType, SCPreferences, SCPreferencesContextType, useSCContext, useSCFetchEvent, useSCPreferences} from '@selfcommunity/react-core';
import {SCCoursePrivacyType, SCCourseType, SCCourseTypologyType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import {ChangeEvent, useCallback, useMemo, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {SCCourseEventType, SCTopicType} from '../../constants/PubSub';
import {PREFIX} from './constants';
import {getLaterHoursDate, getNewDate} from '../EventForm/utils';
import CourseForm from '../CourseForm';
import {SCCourseFormStepType} from '../CourseForm/CourseForm';
import Widget from '../Widget';

const classes = {
  root: `${PREFIX}-edit-root`,
  access: `${PREFIX}-edit-access`,
  card: `${PREFIX}-edit-card`,
  accessInfo: `${PREFIX}-edit-access-info`,
  publish: `${PREFIX}-edit-publish`,
  publishInfo: `${PREFIX}-edit-publish-info`,
  privacyItem: `${PREFIX}-edit-privacy-item`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface CourseEditProps extends BoxProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Course Object
   * @default null
   */
  course: SCCourseType;

  /**
   * On success callback function
   * @default null
   */
  onSuccess?: (data: SCCourseType) => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function CourseEdit(inProps: CourseEditProps): JSX.Element {
  //PROPS
  const props: CourseEditProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, onSuccess, course, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();

  // INTL
  const intl = useIntl();

  // STATE

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Box className={classes.access}>
        <Typography variant="h5">
          <FormattedMessage id="ui.courseForm.edit.access.section.title" defaultMessage="ui.courseForm.edit.access.section.title" />
        </Typography>
        <Widget className={classes.card}>
          <Icon fontSize="medium" color="warning">
            error
          </Icon>
          <Box>
            <Typography variant="h5">
              <FormattedMessage id="ui.courseForm.edit.access.info.title" defaultMessage="ui.courseForm.edit.access.info.title" />
            </Typography>
            <Typography variant="body1">
              <FormattedMessage id="ui.courseForm.edit.access.info.subtitle" defaultMessage="ui.courseForm.edit.access.info.subtitle" />
            </Typography>
            <Box className={classes.accessInfo}>
              <Typography variant="body1">
                <FormattedMessage
                  id="ui.courseForm.edit.access.info.access"
                  defaultMessage="ui.courseForm.edit.access.info.access"
                  values={{icon: (...chunks) => <Icon>{chunks}</Icon>}}
                />
              </Typography>
              <Typography variant="body1">
                <FormattedMessage
                  id="ui.courseForm.edit.access.info.visibility"
                  defaultMessage="ui.courseForm.edit.access.info.visibility"
                  values={{icon: (...chunks) => <Icon>{chunks}</Icon>}}
                />
              </Typography>
            </Box>
          </Box>
        </Widget>
      </Box>
      <Box className={classes.publish}>
        <Typography variant="h5">
          <FormattedMessage id="ui.courseForm.edit.publication.title" defaultMessage="ui.courseForm.edit.publication.title" />
        </Typography>
        <Typography variant="body1" className={classes.publishInfo}>
          <FormattedMessage id="ui.courseForm.edit.publication.subtitle" defaultMessage="ui.courseForm.edit.publication.subtitle" />
        </Typography>
        <RadioGroup>
          {Object.values(SCCoursePrivacyType).map((option, index) => (
            <FormControl key={index} className={classes.privacyItem}>
              <FormControlLabel
                control={<Radio size="small" value={option} />}
                label={
                  <FormattedMessage
                    id={`ui.courseForm.edit.publication.option.${option}.title`}
                    defaultMessage={`ui.courseForm.edit.publication.option.${option}.title`}
                  />
                }
              />
              <FormHelperText>
                <Typography variant="body1">
                  <FormattedMessage
                    id={`ui.courseForm.edit.publication.option.${option}.access`}
                    defaultMessage={`ui.courseForm.edit.publication.option.${option}.access`}
                    values={{icon: (...chunks) => <Icon>{chunks}</Icon>}}
                  />
                </Typography>
                <Typography variant="body1">
                  <FormattedMessage
                    id={`ui.courseForm.edit.publication.option.${option}.visibility`}
                    defaultMessage={`ui.courseForm.edit.publication.option.${option}.visibility`}
                    values={{icon: (...chunks) => <Icon>{chunks}</Icon>}}
                  />
                </Typography>
              </FormHelperText>
            </FormControl>
          ))}
        </RadioGroup>
      </Box>
    </Root>
  );
}
