import React, {useEffect, useMemo, useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Fade,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import Category, {CategoryProps} from './Steps/Category';
import {PREFIX} from './constants';
import {SCContextType, SCThemeType, SCUserContextType, usePreviousValue, useSCContext, useSCUser} from '@selfcommunity/react-core';
import Appearance, {AppearanceProps} from './Steps/Appearance';
import Profile, {ProfileProps} from './Steps/Profile';
import Invite, {InviteProps} from './Steps/Invite';
import App, {AppProps} from './Steps/App';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import Widget from '../Widget';
import Content, {ContentProps} from './Steps/Content';
import Header from '../../assets/onBoarding/Header';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {OnBoardingService, StartStepParams} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOnBoardingStepStatusType, SCOnBoardingStepType, SCStepType} from '@selfcommunity/types';
import OnBoardingWidgetSkeleton from './Skeleton';
import {closeSnackbar, SnackbarKey, useSnackbar} from 'notistack';
import {CONSOLE_PROD, CONSOLE_STAGE} from '../PlatformWidget/constants';

const classes = {
  root: `${PREFIX}-root`,
  accordionRoot: `${PREFIX}-accordion-root`,
  logo: `${PREFIX}-logo`,
  intro: `${PREFIX}-intro`,
  steps: `${PREFIX}-steps`,
  stepsMobile: `${PREFIX}-steps-mobile`,
  stepContent: `${PREFIX}-step-content`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

const AccordionRoot = styled(Accordion, {
  name: PREFIX,
  slot: 'AccordionRoot',
  overridesResolver: (props, styles) => styles.accordionRoot
})(() => ({}));

export interface OnBoardingWidgetProps {
  className?: string;
  CategoryProps?: CategoryProps;
  ContentProps?: ContentProps;
  AppearanceProps?: AppearanceProps;
  ProfileProps?: ProfileProps;
  InviteProps?: InviteProps;
  AppProps: AppProps;
  generateContentsParams?: StartStepParams;
}

const OnBoardingWidget = (inProps: OnBoardingWidgetProps) => {
  // PROPS
  const props: OnBoardingWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className,
    AppearanceProps = {},
    ProfileProps = {},
    CategoryProps = {},
    InviteProps = {},
    AppProps = {},
    ContentProps = {},
    generateContentsParams = {},
    ...rest
  } = props;

  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [steps, setSteps] = useState<SCStepType[]>([]);
  const currentStep = useMemo(() => {
    const step = steps?.find((step) => step.status === 'in_progress' || step.status === 'not_started');
    return step || steps?.[0];
  }, [steps]);
  const allStepsDone = useMemo(() => {
    return steps?.every((step) => step.status === SCOnBoardingStepStatusType.COMPLETED);
  }, [steps]);
  const [expanded, setExpanded] = useState(!allStepsDone);
  const [_step, setStep] = useState<SCStepType>(currentStep);
  const prevStep = usePreviousValue(_step);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scContext: SCContextType = useSCContext();
  const {enqueueSnackbar} = useSnackbar();
  const isStage = scContext.settings.portal.includes('stage');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // HANDLERS

  const completeStep = async (s: SCStepType) => {
    if (s.status !== SCOnBoardingStepStatusType.COMPLETED) {
      await OnBoardingService.completeAStep(s.id)
        .then(() => {
          setSteps((prev) =>
            prev.map((item) => {
              if (item.id === s.id) {
                return {...item, status: SCOnBoardingStepStatusType.COMPLETED, completion_percentage: 100};
              }
              return item;
            })
          );
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  };

  const showSuccessAlert = (step: SCStepType) => {
    setIsGenerating(false);
    enqueueSnackbar(
      <FormattedMessage id={`ui.onBoardingWidget.step.${step.step}.success`} defaultMessage={`ui.onBoardingWidget.step.${step.step}.success`} />,
      {
        action: (snackbarId: SnackbarKey) => (
          <>
            {step.step === SCOnBoardingStepType.CATEGORIES && (
              <Button
                sx={{textTransform: 'uppercase', color: 'white'}}
                size="small"
                variant="text"
                href={isStage ? CONSOLE_STAGE : CONSOLE_PROD}
                target="_blank">
                <FormattedMessage
                  id="ui.onBoardingWidget.step.categories.success.link"
                  defaultMessage="ui.onBoardingWidget.step.categories.success.link"
                />
              </Button>
            )}
            <IconButton sx={{color: 'white'}} onClick={() => closeSnackbar(snackbarId)}>
              <Icon>close</Icon>
            </IconButton>
          </>
        ),
        variant: 'success',
        autoHideDuration: 7000
      }
    );
  };

  const getSteps = async () => {
    await OnBoardingService.getAllSteps()
      .then((res) => {
        setIsGenerating(res.results.some((step) => step.status === 'in_progress'));
        setSteps(res.results);
        setIsLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        setIsLoading(false);
      });
  };

  const handleChange = (newStep: SCStepType) => {
    setStep(newStep);
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const generateContent = async (stepId: number) => {
    await OnBoardingService.startAStep(stepId, generateContentsParams)
      .then(() => {
        setIsGenerating(true);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  };

  // EFFECTS

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (prevStep?.status === SCOnBoardingStepStatusType.IN_PROGRESS && _step?.status === SCOnBoardingStepStatusType.NOT_STARTED) {
      showSuccessAlert(prevStep);
    }
  }, [_step, prevStep]);

  useEffect(() => {
    setStep(currentStep);
  }, [currentStep, steps]);

  useEffect(() => {
    setExpanded(!allStepsDone);
  }, [allStepsDone]);

  useEffect(() => {
    getSteps();
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const intervalId = setInterval(getSteps, isGenerating ? 3000 : 3 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [scUserContext?.user, isGenerating]);

  /**
   * Render _step content section
   */
  const getStepContent = () => {
    const stepObj = _step;
    let content;
    switch (stepObj?.step) {
      case SCOnBoardingStepType.CONTENTS:
        content = <Content step={stepObj} handleContentCreation={() => generateContent(stepObj.id)} {...ContentProps} />;
        break;
      case SCOnBoardingStepType.CATEGORIES:
        content = <Category step={stepObj} handleCategoriesCreation={() => generateContent(stepObj.id)} {...CategoryProps} />;
        break;
      case SCOnBoardingStepType.APPEARANCE:
        content = <Appearance onCompleteAction={() => completeStep(stepObj)} {...AppearanceProps} />;
        break;
      case SCOnBoardingStepType.PROFILE:
        content = <Profile onCompleteAction={() => completeStep(stepObj)} {...ProfileProps} />;
        break;
      case SCOnBoardingStepType.INVITE:
        content = <Invite onCompleteAction={() => completeStep(stepObj)} {...InviteProps} />;
        break;
      case SCOnBoardingStepType.APP:
        content = <App step={stepObj} onCompleteAction={() => completeStep(stepObj)} {...AppProps} />;
        break;
      default:
        break;
    }
    return content;
  };

  if (!scUserContext?.user) {
    return <HiddenPlaceholder />;
  }

  return (
    <AccordionRoot defaultExpanded onChange={handleExpand} className={classes.accordionRoot} expanded={expanded}>
      <AccordionSummary expandIcon={<Icon fontSize="medium">expand_more</Icon>} aria-controls="accordion" id="onBoarding-accordion">
        <>
          {expanded ? (
            <>
              {!isMobile ? (
                <CardMedia className={classes.logo} component="div">
                  <Header />
                </CardMedia>
              ) : (
                <Typography variant="h4" textAlign="center">
                  <FormattedMessage
                    id="ui.onBoardingWidget.accordion.expanded.title.mobile"
                    defaultMessage="ui.onBoardingWidget.accordion.expanded.title.mobile"
                    values={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                      // @ts-ignore
                      b: (chunks) => <strong>{chunks}</strong>,
                      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                      // @ts-ignore
                      icon: (...chunks) => (
                        <Icon color="secondary" fontSize="medium">
                          {chunks}
                        </Icon>
                      )
                    }}
                  />
                </Typography>
              )}
              <Box className={classes.intro}>
                {!isMobile && (
                  <Typography variant="h4">
                    <FormattedMessage
                      id="ui.onBoardingWidget.accordion.expanded.title"
                      defaultMessage="ui.onBoardingWidget.accordion.expanded.title"
                    />
                  </Typography>
                )}
                <Typography variant={!isMobile ? 'h5' : 'subtitle1'}>
                  <FormattedMessage
                    id="ui.onBoardingWidget.accordion.expanded.subtitle"
                    defaultMessage="ui.onBoardingWidget.accordion.expanded.subtitle"
                  />
                </Typography>
                <Typography>
                  <FormattedMessage
                    id="ui.onBoardingWidget.accordion.expanded.summary"
                    defaultMessage="ui.onBoardingWidget.accordion.expanded.summary"
                    values={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                      // @ts-ignore
                      b: (chunks) => <strong>{chunks}</strong>,
                      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                      // @ts-ignore
                      icon: (...chunks) => <Icon>{chunks}</Icon>
                    }}
                  />
                </Typography>
              </Box>
            </>
          ) : (
            <Typography variant="body1">
              <FormattedMessage
                id="ui.onBoardingWidget.accordion.collapsed"
                defaultMessage="ui.onBoardingWidget.accordion.collapsed"
                values={{
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  b: (chunks) => <strong>{chunks}</strong>,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  icon: (...chunks) => (
                    <Icon color="secondary" fontSize="medium">
                      {chunks}
                    </Icon>
                  )
                }}
              />
            </Typography>
          )}
        </>
      </AccordionSummary>
      <AccordionDetails>
        <Root className={classNames(classes.root, className)} {...rest} elevation={0}>
          {isLoading ? (
            <OnBoardingWidgetSkeleton />
          ) : (
            <CardContent>
              <List className={isMobile ? classes.stepsMobile : classes.steps}>
                {steps?.map((step: SCStepType) => (
                  <ListItem key={step.id}>
                    {isMobile ? (
                      <Chip
                        size="small"
                        disabled={isGenerating && (_step?.step === SCOnBoardingStepType.CATEGORIES || _step?.step === SCOnBoardingStepType.CONTENTS)}
                        label={
                          <>
                            <FormattedMessage id={`ui.onBoardingWidget.${step.step}`} defaultMessage={`ui.onBoardingWidget.${step.step}`} />{' '}
                            {step.status === SCOnBoardingStepStatusType.COMPLETED && (
                              <Icon color={step.status === SCOnBoardingStepStatusType.COMPLETED && step.step !== _step.step ? 'success' : 'inherit'}>
                                check
                              </Icon>
                            )}
                          </>
                        }
                        onClick={() => handleChange(step)}
                        variant={step.step === _step.step ? 'filled' : 'outlined'}
                        color={step.status === SCOnBoardingStepStatusType.COMPLETED ? 'success' : 'default'}
                      />
                    ) : (
                      <ListItemButton
                        onClick={() => handleChange(step)}
                        selected={step?.step === _step?.step}
                        disabled={isGenerating && (_step?.step === SCOnBoardingStepType.CATEGORIES || _step?.step === SCOnBoardingStepType.CONTENTS)}>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={step.status === SCOnBoardingStepStatusType.COMPLETED}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{'aria-labelledby': step.step}}
                            size={'small'}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={<FormattedMessage id={`ui.onBoardingWidget.${step.step}`} defaultMessage={`ui.onBoardingWidget.${step.step}`} />}
                        />
                      </ListItemButton>
                    )}
                  </ListItem>
                ))}
              </List>
              <Box className={classes.stepContent}>
                <Fade in timeout={2400}>
                  <Box>{getStepContent()}</Box>
                </Fade>
              </Box>
            </CardContent>
          )}
        </Root>
      </AccordionDetails>
    </AccordionRoot>
  );
};

export default OnBoardingWidget;
