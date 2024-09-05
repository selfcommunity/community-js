import React, {useEffect, useMemo, useState} from 'react';
import {
  Box,
  Fade,
  useTheme,
  useMediaQuery,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Icon,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Chip,
  CardMedia
} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import Category, {CategoryProps} from './Steps/Category';
import {PREFIX} from './constants';
import {SCContextType, SCThemeType, SCUserContextType, useSCContext, useSCUser} from '@selfcommunity/react-core';
import Appearance, {AppearanceProps} from './Steps/Appearance';
import Profile, {ProfileProps} from './Steps/Profile';
import Invite, {InviteProps} from './Steps/Invite';
import App, {AppProps} from './Steps/App';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import Widget from '../Widget';
import Content, {ContentProps} from './Steps/Content';
import Header from '../../assets/onBoarding/Header';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {OnBoardingService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOnBoardingStepStatusType, SCOnBoardingStepType, SCStepType} from '@selfcommunity/types';
import OnBoardingWidgetSkeleton from './Skeleton';

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
}

const OnBoardingWidget = (inProps: OnBoardingWidgetProps) => {
  // PROPS
  const props: OnBoardingWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, AppearanceProps = {}, ProfileProps = {}, CategoryProps = {}, InviteProps = {}, AppProps = {}, ContentProps = {}, ...rest} = props;

  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [steps, setSteps] = useState<SCStepType[]>([]);
  const initialStep = useMemo(() => {
    const step = steps?.find((step) => step.status === 'not_started' || step.status === 'in_progress');
    return step || steps?.[0];
  }, [steps]);
  const allStepsDone = useMemo(() => {
    return steps?.every((step) => step.status === SCOnBoardingStepStatusType.COMPLETED);
  }, [steps]);
  const [_step, setStep] = useState<SCStepType>(initialStep ?? steps[0]);
  const [expanded, setExpanded] = useState(!allStepsDone);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scContext: SCContextType = useSCContext();

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  //console.log(steps);

  // HANDLERS

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  const completeStep = async (stepId) => {
    await OnBoardingService.completeAStep(stepId)
      .then((res: any) => {
        console.log(res);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  };

  const getSteps = async () => {
    await OnBoardingService.getAllSteps()
      .then((res) => {
        setSteps(res.results);
        setIsLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getSteps();
    //runs every 2 minutes
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const intervalId = setInterval(getSteps, 2 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [scUserContext?.user]);

  const handleChange = (newStep: SCStepType) => {
    setStep(newStep);
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  /**
   * Render _step content section
   */
  const getStepContent = (_step: SCStepType) => {
    let content;
    switch (_step?.step) {
      case SCOnBoardingStepType.CONTENTS:
        content = <Content step={_step} {...ContentProps} />;
        break;
      case SCOnBoardingStepType.CATEGORIES:
        content = <Category step={_step} {...CategoryProps} />;
        break;
      case SCOnBoardingStepType.APPEARANCE:
        content = <Appearance step={_step} onCompleteAction={(id) => completeStep(id)} {...AppearanceProps} />;
        break;
      case SCOnBoardingStepType.PROFILE:
        content = <Profile step={_step} onCompleteAction={(id) => completeStep(id)} {...ProfileProps} />;
        break;
      case SCOnBoardingStepType.INVITE:
        content = <Invite step={_step} onCompleteAction={(id) => completeStep(id)} {...InviteProps} />;
        break;
      case SCOnBoardingStepType.APP:
        content = <App step={_step} onCompleteAction={(id) => completeStep(id)} {...AppProps} />;
        break;
      default:
        break;
    }
    return (
      <Fade in timeout={2400}>
        <Box>{content}</Box>
      </Fade>
    );
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
                <Typography variant={!isMobile ? 'h5' : 'inherit'}>
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
                        label={
                          <>
                            <FormattedMessage id={`ui.onBoardingWidget.${step.step}`} defaultMessage={`ui.onBoardingWidget.${step.step}`} />{' '}
                            {step.status === SCOnBoardingStepStatusType.COMPLETED && <Icon>check</Icon>}
                          </>
                        }
                        onClick={() => handleChange(step)}
                        variant="outlined"
                        color={step.step === _step.step ? 'success' : 'default'}
                      />
                    ) : (
                      <ListItemButton role={undefined} onClick={() => handleChange(step)} selected={step?.step === _step?.step}>
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
              <Box className={classes.stepContent}>{getStepContent(_step)}</Box>
            </CardContent>
          )}
        </Root>
      </AccordionDetails>
    </AccordionRoot>
  );
};

export default OnBoardingWidget;
