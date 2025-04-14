import React, {useCallback} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Box, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import CardContent from '@mui/material/CardContent';
import {getContributionHtml} from '../../utils/contribution';
import Widget from '../Widget';
import ContentLesson from '../Composer/Content/ContentLesson';
import {EditorProps} from '../Editor';
import {SCCourseLessonType, SCCourseType, SCMediaType} from '@selfcommunity/types';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import DisplayComponent from '../../shared/Media/Link/DisplayComponent';
import LessonFilePreview from '../../shared/LessonFilePreview';
import {MediaTypes} from '@selfcommunity/api-services';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  contentEdit: `${PREFIX}-content-edit`,
  title: `${PREFIX}-title`,
  text: `${PREFIX}-text`,
  mediasSection: `${PREFIX}-medias-section`,
  files: `${PREFIX}-files`,
  navigation: `${PREFIX}-navigation`,
  editor: `${PREFIX}-editor`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => [styles.root]
})(() => ({}));

export interface LessonObjectProps {
  /**
   * The lesson obj
   */
  lesson: SCCourseLessonType;
  /**
   * The course obj
   */
  course: SCCourseType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The edit mode
   * @default false
   */
  editMode: boolean;
  /**
   * Callback fired when the lesson content on edit mode changes
   */
  onContentChange?: (content) => void;
  /**
   * Callback fired when the lesson media on edit mode changes
   */
  onMediaChange?: (medias: SCMediaType[]) => void | null;
  /**
   * Editor props
   * @default {}
   */
  EditorProps?: Omit<EditorProps, 'onFocus'>;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function LessonObject(inProps: LessonObjectProps): JSX.Element {
  // PROPS
  const props: LessonObjectProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, course, lesson, editMode, EditorProps = {}, onContentChange, onMediaChange, isSubmitting, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HANDLERS

  const handleChangeLesson = useCallback(
    (content: any) => {
      if (onContentChange) {
        onContentChange(content);
      }
    },
    [onContentChange]
  );

  const handleChangeMedia = useCallback(
    (medias: SCMediaType[]) => {
      if (onMediaChange) {
        onMediaChange(medias);
      }
    },
    [onMediaChange]
  );

  // RENDER
  if (!course || !lesson) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      <Widget>
        <CardContent classes={{root: editMode ? classes.contentEdit : classes.content}}>
          {editMode ? (
            <ContentLesson
              value={lesson}
              //error={{error}}
              onChange={handleChangeLesson}
              onMediaChange={handleChangeMedia}
              disabled={isSubmitting}
              EditorProps={{
                toolbar: true,
                ...EditorProps
              }}
            />
          ) : (
            <>
              <Typography
                component="div"
                gutterBottom
                className={classes.text}
                dangerouslySetInnerHTML={{
                  __html: getContributionHtml(lesson.html, scRoutingContext.url)
                }}
              />
              {lesson.medias && lesson.medias.length > 0 && (
                <Box className={classes.mediasSection}>
                  {lesson.medias
                    .filter((media) => media.type === MediaTypes.URL)
                    .map((media) => (
                      <DisplayComponent key={media.id} medias={[media]} />
                    ))}

                  {lesson.medias.some((media) => media.type !== MediaTypes.URL) && (
                    <Box className={classes.files}>
                      {lesson.medias
                        .filter((media) => media.type !== MediaTypes.URL)
                        .map((media) => (
                          <LessonFilePreview key={media.id} media={media} />
                        ))}
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Widget>
    </Root>
  );
}
