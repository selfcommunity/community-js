import {Box, BoxProps, FormControl, FormControlLabel, Icon, Radio, RadioGroup, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCCourseLessonStatusType, SCCoursePrivacyType, SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from './constants';
import Widget from '../Widget';
import {ReactNode, useState} from 'react';

const classes = {
  root: `${PREFIX}-edit-root`,
  access: `${PREFIX}-edit-access`,
  card: `${PREFIX}-edit-card`,
  accessInfo: `${PREFIX}-edit-access-info`,
  publish: `${PREFIX}-edit-publish`,
  publishInfo: `${PREFIX}-edit-publish-info`,
  privacyItem: `${PREFIX}-edit-privacy-item`,
  privacyItemInfo: `${PREFIX}-edit-privacy-item-info`,
  disabled: `${PREFIX}-disabled`
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
   * On privacy change callback function
   * @default null
   */
  onPrivacyChange?: (privacy: SCCoursePrivacyType) => void;
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
  const {className, onPrivacyChange, course, ...rest} = props;

  // STATE
  const [privacy, setPrivacy] = useState<SCCoursePrivacyType>(course.privacy);
  const notPublishable =
    course.num_lessons === 0 ||
    !course.sections?.some((section: SCCourseSectionType) => section.lessons.some((lesson) => lesson.status === SCCourseLessonStatusType.PUBLISHED));

  //HANDLERS

  const handleChange = (event) => {
    setPrivacy(event.target.value);
    onPrivacyChange(event.target.value);
  };

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {course.privacy === SCCoursePrivacyType.DRAFT && (
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
                    values={{icon: (...chunks: [parts: ReactNode[]]) => <Icon>{chunks}</Icon>}}
                  />
                </Typography>
                <Typography variant="body1">
                  <FormattedMessage
                    id="ui.courseForm.edit.access.info.visibility"
                    defaultMessage="ui.courseForm.edit.access.info.visibility"
                    values={{icon: (...chunks: [parts: ReactNode[]]) => <Icon>{chunks}</Icon>}}
                  />
                </Typography>
              </Box>
            </Box>
          </Widget>
        </Box>
      )}
      <Box className={classes.publish}>
        <Typography variant="h5">
          <FormattedMessage id="ui.courseForm.edit.publication.title" defaultMessage="ui.courseForm.edit.publication.title" />
        </Typography>
        {notPublishable ? (
          <Widget className={classes.card}>
            <Icon fontSize="medium" color="warning">
              error
            </Icon>
            <Typography>
              <FormattedMessage id="ui.courseForm.edit.publication.subtitle.info" defaultMessage="ui.courseForm.edit.publication.subtitle.info" />
            </Typography>
          </Widget>
        ) : (
          <Typography variant="body1" className={classes.publishInfo}>
            <FormattedMessage id="ui.courseForm.edit.publication.subtitle" defaultMessage="ui.courseForm.edit.publication.subtitle" />
          </Typography>
        )}
        <RadioGroup>
          {Object.values(SCCoursePrivacyType)
            .filter((option) => option !== SCCoursePrivacyType.DRAFT)
            .map((option, index) => (
              <FormControl key={index} className={classes.privacyItem} disabled={notPublishable}>
                <FormControlLabel
                  control={<Radio size="small" value={option} checked={option === privacy} onChange={handleChange} disabled={notPublishable} />}
                  label={
                    <FormattedMessage
                      id={`ui.courseForm.edit.publication.option.${option}.title`}
                      defaultMessage={`ui.courseForm.edit.publication.option.${option}.title`}
                    />
                  }
                />
                <>
                  <Typography variant="body1" className={classNames(classes.privacyItemInfo, {[classes.disabled]: notPublishable})}>
                    <FormattedMessage
                      id={`ui.courseForm.edit.publication.option.${option}.access`}
                      defaultMessage={`ui.courseForm.edit.publication.option.${option}.access`}
                      values={{icon: (...chunks: [parts: ReactNode[]]) => <Icon>{chunks}</Icon>}}
                    />
                  </Typography>
                  <Typography variant="body1" className={classNames(classes.privacyItemInfo, {[classes.disabled]: notPublishable})}>
                    <FormattedMessage
                      id={`ui.courseForm.edit.publication.option.${option}.visibility`}
                      defaultMessage={`ui.courseForm.edit.publication.option.${option}.visibility`}
                      values={{icon: (...chunks: [parts: ReactNode[]]) => <Icon>{chunks}</Icon>}}
                    />
                  </Typography>
                </>
              </FormControl>
            ))}
        </RadioGroup>
      </Box>
    </Root>
  );
}
