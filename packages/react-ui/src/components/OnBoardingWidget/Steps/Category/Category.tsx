import {styled} from '@mui/material/styles';
import {Alert, Button, CardMedia, Icon, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from '../../constants';
import CategoryA from '../../../../assets/onBoarding/CategoryA';
import CategoryB from '../../../../assets/onBoarding/CategoryB';
import ProgressBar from '../../../../shared/ProgressBar';
import {SCOnBoardingStepStatusType, SCStepType} from '@selfcommunity/types';

const classes = {
  root: `${PREFIX}-category-root`,
  title: `${PREFIX}-category-title`,
  summary: `${PREFIX}-category-summary`,
  image: `${PREFIX}-category-image`,
  action: `${PREFIX}-category-action`,
  button: `${PREFIX}-category-button`,
  success: `${PREFIX}-success`
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
          if (prev >= 90) {
            clearInterval(intervalId);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [step.status]);

  return (
    <Root className={classNames(classes.root, className)}>
      <Typography variant="h4" className={classes.title}>
        <FormattedMessage id="ui.onBoardingWidget.categories" defaultMessage="ui.onBoardingWidget.categories" />
      </Typography>
      <Typography className={classes.summary}>
        <FormattedMessage id="ui.onBoardingWidget.step.category.summary" defaultMessage="ui.onBoardingWidget.step.category.summary" />
      </Typography>
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
      <CardMedia className={classes.image} component="div">
        <CategoryA />
      </CardMedia>
      <CardMedia className={classes.image} component="div">
        <CategoryB />
      </CardMedia>
      <Box component="span" className={classes.action}>
        {step?.status === SCOnBoardingStepStatusType.COMPLETED ? (
          <Alert severity="success">
            <FormattedMessage id="ui.onBoardingWidget.step.categories.success" defaultMessage="ui.onBoardingWidget.step.categories.success" />
          </Alert>
        ) : step?.status === SCOnBoardingStepStatusType.IN_PROGRESS ? (
          <ProgressBar
            value={progress}
            loadingMessage={
              <Typography variant="h4">
                <FormattedMessage id="ui.onBoardingWidget.step.categories.loading" defaultMessage="ui.onBoardingWidget.step.categories.loading" />
              </Typography>
            }
          />
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
