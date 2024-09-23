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
import Category from './Steps/Category';
import {PREFIX} from './constants';
import {
  getTheme,
  SCContextType,
  SCPreferencesContextType,
  SCThemeContextType,
  SCThemeType,
  SCUserContextType,
  usePreviousValue,
  UserUtils,
  useSCContext,
  useSCPreferences,
  useSCTheme,
  useSCUser
} from '@selfcommunity/react-core';
import Appearance from './Steps/Appearance';
import Profile from './Steps/Profile';
import Invite from './Steps/Invite';
import App from './Steps/App';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import Widget from '../Widget';
import Content from './Steps/Content';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {OnBoardingService, PreferenceService, StartStepParams} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCFeedObjectType, SCOnBoardingStepStatusType, SCOnBoardingStepType, SCStepType} from '@selfcommunity/types';
import OnBoardingWidgetSkeleton from './Skeleton';
import {closeSnackbar, SnackbarKey, useSnackbar} from 'notistack';
import {CONSOLE_PROD, CONSOLE_STAGE} from '../PlatformWidget/constants';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import HeaderPlaceholder from '../../assets/onBoarding/header';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
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

export interface OnBoardingWidgetProps extends VirtualScrollerItemProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The params to add to content step generation
   * @default {}
   */
  GenerateContentsParams?: StartStepParams;
  /**
   * The callback to pass to the feeds to publish the generated content
   * @param feedObj
   * @default null
   */
  onGeneratedContent?: (feedObjs: SCFeedObjectType[]) => void;
}

const OnBoardingWidget = (inProps: OnBoardingWidgetProps) => {
  // PROPS
  const props: OnBoardingWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, GenerateContentsParams = {}, onGeneratedContent = null, onHeightChange, ...rest} = props;

  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [steps, setSteps] = useState<SCStepType[]>([]);
  const nextStep = useMemo(() => {
    const step = steps?.find((step) => step.status === 'in_progress' || step.status === 'not_started');
    return step || steps?.[0];
  }, [steps]);
  const allStepsDone = useMemo(() => {
    return steps?.every((step) => step.status === SCOnBoardingStepStatusType.COMPLETED);
  }, [steps]);
  const [expanded, setExpanded] = useState(!allStepsDone);
  const [_step, setStep] = useState<SCStepType>(nextStep);
  const currentContentsStep = steps?.find((s) => s.step === SCOnBoardingStepType.CONTENTS);
  const prevContentsStep = usePreviousValue(currentContentsStep);
  const currentCategoriesStep = steps?.find((s) => s.step === SCOnBoardingStepType.CATEGORIES);
  const prevCategoriesStep = usePreviousValue(currentCategoriesStep);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const isAdmin = useMemo(() => UserUtils.isCommunityCreator(scUserContext.user), [scUserContext.user]);
  const scContext: SCContextType = useSCContext();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const scThemeContext: SCThemeContextType = useSCTheme();
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
    s.step === SCOnBoardingStepType.APPEARANCE && handlePreferencesUpdate();
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
        const contentStep = res.results.find((step) => step.step === SCOnBoardingStepType.CONTENTS);
        setIsGenerating(res.results.some((step) => step.status === 'in_progress'));
        setSteps(res.results);
        setIsLoading(false);
        if (contentStep.status === SCOnBoardingStepStatusType.IN_PROGRESS && contentStep.results.length !== 0 && onGeneratedContent) {
          onGeneratedContent(contentStep.results as SCFeedObjectType[]);
        }
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
    onHeightChange && onHeightChange();
  };

  const generateContent = async (stepId: number) => {
    await OnBoardingService.startAStep(stepId, GenerateContentsParams)
      .then(() => {
        setIsGenerating(true);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  };

  const handlePreferencesUpdate = () => {
    PreferenceService.getAllPreferences().then((preferences) => {
      const prefs = preferences['results'].reduce((obj, p) => ({...obj, [`${p.section}.${p.name}`]: p}), {});
      scPreferencesContext.setPreferences(prefs);
      scThemeContext.setTheme(getTheme(scContext.settings.theme, prefs));
    });
  };

  // EFFECTS

  useEffect(() => {
    if (
      prevContentsStep &&
      (prevContentsStep as SCStepType).status === SCOnBoardingStepStatusType.IN_PROGRESS &&
      currentContentsStep?.status === SCOnBoardingStepStatusType.COMPLETED
    ) {
      showSuccessAlert(currentContentsStep);
    }
  }, [currentContentsStep, prevContentsStep]);

  useEffect(() => {
    if (
      prevCategoriesStep &&
      (prevCategoriesStep as SCStepType).status === SCOnBoardingStepStatusType.IN_PROGRESS &&
      currentCategoriesStep?.status === SCOnBoardingStepStatusType.COMPLETED
    ) {
      showSuccessAlert(currentCategoriesStep);
    }
  }, [currentCategoriesStep, prevCategoriesStep]);

  useEffect(() => {
    if (!initialized && nextStep) {
      setStep(nextStep);
      setInitialized(true);
    }
  }, [initialized, nextStep]);

  useEffect(() => {
    setExpanded(!allStepsDone);
    onHeightChange && onHeightChange();
  }, [allStepsDone]);

  useEffect(() => {
    if (isAdmin) {
      getSteps();
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      const intervalId = setInterval(getSteps, isGenerating ? 6000 : 3 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [scUserContext?.user, isGenerating, isAdmin]);

  /**
   * Render _step content section
   */
  const getStepContent = () => {
    const stepObj = steps?.find((obj) => obj.step === _step?.step);
    let content;
    switch (stepObj?.step) {
      case SCOnBoardingStepType.CONTENTS:
        content = <Content step={stepObj} handleContentCreation={() => generateContent(stepObj.id)} />;
        break;
      case SCOnBoardingStepType.CATEGORIES:
        content = <Category step={stepObj} handleCategoriesCreation={() => generateContent(stepObj.id)} />;
        break;
      case SCOnBoardingStepType.APPEARANCE:
        content = <Appearance onCompleteAction={() => completeStep(stepObj)} />;
        break;
      case SCOnBoardingStepType.PROFILE:
        content = <Profile onCompleteAction={() => completeStep(stepObj)} />;
        break;
      case SCOnBoardingStepType.INVITE:
        content = <Invite onCompleteAction={() => completeStep(stepObj)} />;
        break;
      case SCOnBoardingStepType.APP:
        content = <App step={stepObj} onCompleteAction={() => completeStep(stepObj)} />;
        break;
      default:
        break;
    }
    return content;
  };

  if (!isAdmin) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <AccordionRoot defaultExpanded onChange={handleExpand} className={classes.accordionRoot} expanded={expanded}>
        <AccordionSummary expandIcon={<Icon fontSize="medium">expand_more</Icon>} aria-controls="accordion" id="onBoarding-accordion">
          <>
            {expanded ? (
              <>
                {!isMobile ? (
                  <CardMedia className={classes.logo} component="img" src={HeaderPlaceholder} />
                ) : (
                  <Typography variant="h4">
                    <Icon color="secondary" fontSize="medium">
                      ai_stars
                    </Icon>
                    <FormattedMessage
                      id="ui.onBoardingWidget.accordion.expanded.title.mobile"
                      defaultMessage="ui.onBoardingWidget.accordion.expanded.title.mobile"
                      values={{
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        b: (chunks) => <strong>{chunks}</strong>
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
                  <Typography variant="h5">
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
          <Widget className={classes.content} elevation={0}>
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
                          label={
                            <>
                              <FormattedMessage id={`ui.onBoardingWidget.${step.step}`} defaultMessage={`ui.onBoardingWidget.${step.step}`} />{' '}
                              {step.status === SCOnBoardingStepStatusType.COMPLETED && (
                                <Icon
                                  color={step?.status === SCOnBoardingStepStatusType.COMPLETED && step?.step !== _step?.step ? 'success' : 'inherit'}>
                                  check
                                </Icon>
                              )}
                            </>
                          }
                          onClick={() => handleChange(step)}
                          variant={step.step === _step?.step ? 'filled' : 'outlined'}
                          color={step.status === SCOnBoardingStepStatusType.COMPLETED ? 'success' : 'default'}
                        />
                      ) : (
                        <ListItemButton onClick={() => handleChange(step)} selected={step?.step === _step?.step}>
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
          </Widget>
        </AccordionDetails>
      </AccordionRoot>
    </Root>
  );
};

export default OnBoardingWidget;
