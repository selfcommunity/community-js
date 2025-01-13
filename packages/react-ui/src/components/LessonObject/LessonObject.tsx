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
import {SCLessonModeType} from '../../types';
import ContentLesson from '../Composer/Content/ContentLesson';
import {EditorProps} from '../Editor';
import {ComposerContentType} from '../../types/composer';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  titleSection: `${PREFIX}-title-section`,
  text: `${PREFIX}-text`,
  textSection: `${PREFIX}-text-section`,
  editor: `${PREFIX}-editor`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

export interface LessonObjectProps {
  /**
   * The lesson object
   */
  lessonObj: any;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The way the lesson is rendered
   * @default SCLessonModeType.VIEW
   */
  mode: SCLessonModeType;
  /**
   * Actions to be inserted at the end of title section
   * @default null
   */
  endActions?: React.ReactNode | null;
  /**
   * Callback fired when the lesson content on edit mode changes
   */
  onContentChange?: (content) => void;
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
  const {
    className = null,
    lessonObj,
    endActions = null,
    mode = SCLessonModeType.VIEW,
    EditorProps = {},
    onContentChange,
    isSubmitting,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HANDLERS

  const handleChangeLesson = useCallback((content: ComposerContentType): void => {
    onContentChange(content);
  }, []);

  /**
   * Rendering
   */

  if (!lessonObj) {
    return null;
  }
  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      <Box className={classes.titleSection}>
        <Typography variant="h5">{lessonObj?.title}</Typography>
        {endActions && endActions}
      </Box>
      <Widget>
        <CardContent classes={{root: classes.content}}>
          {mode === SCLessonModeType.EDIT ? (
            <ContentLesson
              value={lessonObj}
              //error={{titleError, error}}
              onChange={handleChangeLesson}
              disabled={isSubmitting}
              EditorProps={{
                toolbar: true,
                uploadImage: true,
                ...EditorProps
              }}
            />
          ) : (
            <Box className={classes.textSection}>
              {' '}
              <Typography
                component="div"
                gutterBottom
                className={classes.text}
                dangerouslySetInnerHTML={{
                  __html: getContributionHtml(lessonObj?.html, scRoutingContext.url)
                }}
              />
            </Box>
          )}
        </CardContent>
      </Widget>
    </Root>
  );
}
