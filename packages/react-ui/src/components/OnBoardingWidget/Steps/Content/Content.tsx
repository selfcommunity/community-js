import {styled} from '@mui/material/styles';
import {Alert, Button, Icon, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import React, {useEffect, useMemo, useState} from 'react';
import {PREFIX} from '../../constants';
import {FormattedMessage} from 'react-intl';
import {SCOnBoardingStepStatusType, SCStepType} from '@selfcommunity/types';
import ProgressBar from '../../../../shared/ProgressBar';
import {Player} from '@lottiefiles/react-lottie-player';
import animatedProgress from '../../../../assets/onBoarding/progress/content_progress.json';

const classes = {
  root: `${PREFIX}-content-root`,
  title: `${PREFIX}-content-title`,
  summary: `${PREFIX}-content-summary`,
  action: `${PREFIX}-content-action`,
  progress: `${PREFIX}-content-progress`,
  animationProgress: `${PREFIX}-content-animation-progress`
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

  const getLoadingMessage = useMemo((): JSX.Element => {
    let message;
    if (progress <= 10) {
      message = <FormattedMessage id="ui.onBoardingWidget.step.contents.loading.a" defaultMessage="ui.onBoardingWidget.step.contents.loading.a" />;
    } else if (progress <= 20) {
      message = <FormattedMessage id="ui.onBoardingWidget.step.contents.loading.b" defaultMessage="ui.onBoardingWidget.step.contents.loading.b" />;
    } else if (progress <= 40) {
      message = <FormattedMessage id="ui.onBoardingWidget.step.contents.loading.c" defaultMessage="ui.onBoardingWidget.step.contents.loading.c" />;
    } else if (progress <= 60) {
      message = <FormattedMessage id="ui.onBoardingWidget.step.contents.loading.d" defaultMessage="ui.onBoardingWidget.step.contents.loading.d" />;
    } else {
      message = <FormattedMessage id="ui.onBoardingWidget.step.contents.loading.e" defaultMessage="ui.onBoardingWidget.step.contents.loading.e" />;
    }
    return message;
  }, [progress]);

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
          <Box className={classes.progress}>
            <Player autoplay loop src={animatedProgress} className={classes.animationProgress} controls={false} />
            <ProgressBar value={progress} hideBar={true} loadingMessage={<Typography variant="h4">{getLoadingMessage}</Typography>} />
          </Box>
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
