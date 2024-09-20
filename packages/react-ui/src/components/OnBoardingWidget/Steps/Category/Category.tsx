import {styled} from '@mui/material/styles';
import {Alert, Button, CardMedia, Icon, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import React, {useEffect, useMemo, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from '../../constants';
import ProgressBar from '../../../../shared/ProgressBar';
import {SCOnBoardingStepStatusType, SCStepType} from '@selfcommunity/types';
import {Player} from '@lottiefiles/react-lottie-player';
import CategoryAPlaceholder from '../../../../assets/onBoarding/categoryA';
import CategoryBPlaceholder from '../../../../assets/onBoarding/categoryB';
import animatedProgress from '../../../../assets/onBoarding/progress/category_progress.json';

const classes = {
  root: `${PREFIX}-category-root`,
  title: `${PREFIX}-category-title`,
  summary: `${PREFIX}-category-summary`,
  image: `${PREFIX}-category-image`,
  action: `${PREFIX}-category-action`,
  button: `${PREFIX}-category-button`,
  success: `${PREFIX}-success`,
  progress: `${PREFIX}-category-progress`,
  animationProgress: `${PREFIX}-category-animation-progress`
};

export interface CategoryProps {
  /**
   * The category step
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
  handleCategoriesCreation?: () => void;
}

function CircledLetter({letter, statement}: {letter: string; statement: any}) {
  return (
    <Box component="span" sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1.5}}>
      <Box
        component="span"
        sx={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          backgroundColor: 'black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Typography
          component="span"
          sx={{
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: 'bold'
          }}>
          {letter}
        </Typography>
      </Box>
      {statement}
    </Box>
  );
}

const Root = styled(Box, {
  name: PREFIX,
  slot: 'CategoryRoot'
})(() => ({}));
export default function Category(inProps: CategoryProps) {
  // PROPS
  const props: CategoryProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, step, handleCategoriesCreation} = props;

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
      message = (<FormattedMessage id="ui.onBoardingWidget.step.categories.loading.a" defaultMessage="ui.onBoardingWidget.step.categories.loading.a" />);
    } else if (progress <= 20) {
      message = (<FormattedMessage id="ui.onBoardingWidget.step.categories.loading.b" defaultMessage="ui.onBoardingWidget.step.categories.loading.b" />);
    } else if (progress <= 40) {
      message = (<FormattedMessage id="ui.onBoardingWidget.step.categories.loading.c" defaultMessage="ui.onBoardingWidget.step.categories.loading.c" />);
    } else if (progress <= 60) {
      message = (<FormattedMessage id="ui.onBoardingWidget.step.categories.loading.d" defaultMessage="ui.onBoardingWidget.step.categories.loading.d" />);
    } else {
      message = (<FormattedMessage id="ui.onBoardingWidget.step.categories.loading.e" defaultMessage="ui.onBoardingWidget.step.categories.loading.e" />);
    }
    return message;
  }, [progress]);

  return (
    <Root className={classNames(classes.root, className)}>
      <Typography variant="h4" className={classes.title}>
        <FormattedMessage id="ui.onBoardingWidget.categories" defaultMessage="ui.onBoardingWidget.categories" />
      </Typography>
      <Typography className={classes.summary}>
        <FormattedMessage id="ui.onBoardingWidget.step.category.summary" defaultMessage="ui.onBoardingWidget.step.category.summary" />
      </Typography>
      {step?.status !== SCOnBoardingStepStatusType.IN_PROGRESS && (
        <>
          <Typography>
            <FormattedMessage
              id="ui.onBoardingWidget.step.category.generation.steps"
              defaultMessage="ui.onBoardingWidget.step.category.generation.steps"
              values={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                iconA: (...chunks) => <CircledLetter letter="a" statement={chunks} />,
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                iconB: (...chunks) => <CircledLetter letter="b" statement={chunks} />,
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                iconC: (...chunks) => <CircledLetter letter="c" statement={chunks} />
              }}
            />
          </Typography>
          <CardMedia className={classes.image} component="img" src={CategoryAPlaceholder} />
          <CardMedia className={classes.image} component="img" src={CategoryBPlaceholder} />
        </>
      )}
      <Box component="span" className={classes.action}>
        {step?.status === SCOnBoardingStepStatusType.COMPLETED ? (
          <Alert severity="success">
            <FormattedMessage id="ui.onBoardingWidget.step.categories.success" defaultMessage="ui.onBoardingWidget.step.categories.success" />
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
            onClick={handleCategoriesCreation}
            endIcon={<Icon>{hover ? 'ai_stars' : 'magic_wand'}</Icon>}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <FormattedMessage defaultMessage="ui.onBoardingWidget.step.category.button" id="ui.onBoardingWidget.step.category.button" />
          </Button>
        )}
      </Box>
    </Root>
  );
}
