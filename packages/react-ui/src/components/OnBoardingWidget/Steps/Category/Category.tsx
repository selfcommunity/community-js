import {styled} from '@mui/material/styles';
import {Alert, Button, CardMedia, Icon, Typography, useMediaQuery, useTheme} from '@mui/material';
import Box from '@mui/material/Box';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import React, {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {
  Link,
  SCContextType,
  SCLocaleContextType,
  SCRoutes,
  SCThemeType,
  SCUserContextType,
  useSCContext,
  useSCLocale,
  useSCUser
} from '@selfcommunity/react-core';
import {OnBoardingService, OnBoardingStep} from '@selfcommunity/api-services';
import {PREFIX} from '../../constants';
import CategoryA from '../../../../assets/onBoarding/CategoryA';
import CategoryB from '../../../../assets/onBoarding/CategoryB';
import ProgressBar from '../../../../shared/ProgressBar';
import {SCOPE_SC_UI} from '../../../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
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
  onSuccess?: (res: any) => void;

  /**
   * Action component to display after success message
   * */
  successAction?: React.ReactNode;
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
  const {className, step, onSuccess, successAction = null} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  const intl = useIntl();

  // STATE
  const [isSucceed, setIsSucceed] = useState<boolean>(false);
  const [hover, setHover] = useState(false);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // useEffect(() => {
  // }, [scUserContext?.user?.id]);

  // HANDLERS

  const handleCategoriesCreation = async () => {
    await OnBoardingService.startAStep(OnBoardingStep.CATEGORIES)
      .then((res: any) => {
        console.log(res);
        setIsSucceed(true);
        // onSuccess && onSuccess(res);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        // setError(true);
        // onError && onError(error);
      });
  };

  return (
    <Root className={classNames(classes.root, className)}>
      {isSucceed && (
        <Alert severity="success" className={classes.success}>
          {intl.formatMessage({
            id: 'ui.onBoardingWidget.step.category.success',
            defaultMessage: 'ui.onBoardingWidget.step.category.success'
          })}
          {successAction}
        </Alert>
      )}
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
        {step.status === SCOnBoardingStepStatusType.COMPLETED ? (
          <Alert severity="success">
            <FormattedMessage id="ui.onBoardingWidget.step.category.success" defaultMessage="ui.onBoardingWidget.step.category.success" />{' '}
          </Alert>
        ) : (
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={handleCategoriesCreation}
            endIcon={<Icon>{hover ? 'ai_stars' : 'magic_wand'}</Icon>}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={step?.status === SCOnBoardingStepStatusType.COMPLETED || step?.status === SCOnBoardingStepStatusType.IN_PROGRESS}>
            <FormattedMessage defaultMessage="ui.onBoardingWidget.step.category.button" id="ui.onBoardingWidget.step.category.button" />
          </Button>
        )}
      </Box>
    </Root>
  );
}
