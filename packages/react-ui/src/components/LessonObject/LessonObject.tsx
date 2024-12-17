import React from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Box, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {SCContributionType, SCCourseType} from '@selfcommunity/types';
import {SCContextType, SCRoutingContextType, useSCContext, useSCFetchFeedObject, useSCRouting} from '@selfcommunity/react-core';
import CardContent from '@mui/material/CardContent';
import {getContributionHtml} from '../../utils/contribution';
import FeedObjectMediaPreview from '../FeedObjectMediaPreview';
import Widget from '../Widget';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  titleSection: `${PREFIX}-title-section`,
  text: `${PREFIX}-text`,
  textSection: `${PREFIX}-text-section`,
  mediasSection: `${PREFIX}-medias-section`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

export interface LessonObjectProps {
  course?: SCCourseType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Actions to be inserted at the end of title section
   * @default null
   */
  endActions?: React.ReactNode | null;
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
    course,
    feedObjectId = 3078,
    feedObject = null,
    feedObjectType = SCContributionType.DISCUSSION,
    endActions = null,
    ...rest
  } = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const {obj, setObj, error} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});

  // HANDLERS

  if (!obj) {
    return null;
  }

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      <Box className={classes.titleSection}>
        <Typography variant="h5">{obj?.title}</Typography>
        {endActions && endActions}
      </Box>
      <Widget>
        <CardContent classes={{root: classes.content}}>
          <Box className={classes.textSection}>
            {' '}
            <Typography
              component="div"
              gutterBottom
              className={classes.text}
              dangerouslySetInnerHTML={{
                __html: getContributionHtml(obj?.html, scRoutingContext.url)
              }}
            />
          </Box>
          <Box className={classes.mediasSection}>
            <FeedObjectMediaPreview medias={obj?.medias} />
          </Box>
        </CardContent>
      </Widget>
    </Root>
  );
}
