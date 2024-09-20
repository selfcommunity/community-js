import {styled} from '@mui/material/styles';
import {Alert, Button, Icon, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import {PREFIX} from '../../constants';
import {FormattedMessage} from 'react-intl';
import {SCOnBoardingStepStatusType, SCStepType} from '@selfcommunity/types';
import ProgressBar from '../../../../shared/ProgressBar';

const classes = {
  root: `${PREFIX}-content-root`,
  title: `${PREFIX}-content-title`,
  summary: `${PREFIX}-content-summary`,
  action: `${PREFIX}-content-action`
};

export interface ContentProps {
  /**
   * The content step
   */
  step: SCStepType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Callback triggered on success category content generation
   * @default null
   */
  handleContentCreation?: () => void;
}

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ContentRoot'
})(() => ({}));
export default function Content(inProps: ContentProps) {
  // PROPS
  const props: ContentProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, step, handleContentCreation} = props;

  // STATE
  const [hover, setHover] = useState(false);
  const [progress, setProgress] = useState(step.completion_percentage);

  useEffect(() => {
    if (step.status === SCOnBoardingStepStatusType.IN_PROGRESS) {
      const intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev < step.completion_percentage) {
            return prev + 1;
          } else {
            clearInterval(intervalId);
            return prev;
          }
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [step.status, step.completion_percentage]);

  return (
    <Root className={classNames(classes.root, className)}>
      <Typography variant="h4" className={classes.title}>
        <FormattedMessage id="ui.onBoardingWidget.contents" defaultMessage="ui.onBoardingWidget.contents" />
      </Typography>
      <Typography className={classes.summary}>
        <FormattedMessage id="ui.onBoardingWidget.step.content.summary" defaultMessage="ui.onBoardingWidget.step.content.summary" />
      </Typography>
      <Box component="span" className={classes.action}>
        {step?.status === SCOnBoardingStepStatusType.COMPLETED ? (
          <Alert severity="success">
            <FormattedMessage id="ui.onBoardingWidget.step.contents.success" defaultMessage="ui.onBoardingWidget.step.contents.success" />
          </Alert>
        ) : step?.status === SCOnBoardingStepStatusType.IN_PROGRESS ? (
          <ProgressBar
            value={progress}
            loadingMessage={
              <Typography variant="h4">
                <FormattedMessage id="ui.onBoardingWidget.step.contents.loading" defaultMessage="ui.onBoardingWidget.step.contents.loading" />
              </Typography>
            }
          />
        ) : (
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={handleContentCreation}
            endIcon={<Icon>{hover ? 'ai_stars' : 'magic_wand'}</Icon>}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <FormattedMessage defaultMessage="ui.onBoardingWidget.step.content.button" id="ui.onBoardingWidget.step.content.button" />
          </Button>
        )}
      </Box>
    </Root>
  );
}
