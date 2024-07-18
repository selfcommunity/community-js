import React, {useCallback, useContext, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Backdrop, Box, Button, Collapse, Divider, Grid, Icon, IconButton, Stack, Tooltip, Typography} from '@mui/material';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Link, SCContextType, SCUserContext, SCUserContextType, UserUtils, useSCContext} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {CONTACT_PROD, CONTACT_STAGE, HUB_PROD, HUB_STAGE, PREFIX} from './constants';
import {Logo as LogoPlaceholder} from '@selfcommunity/react-theme-default';
import Grow from '@mui/material/Grow';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`,
  action: `${PREFIX}-action`,
  actionHighlighted: `${PREFIX}-action-highlighted`,
  tutorial: `${PREFIX}-tutorial`,
  tutorialContent: `${PREFIX}-tutorial-content`,
  tutorialTitle: `${PREFIX}-tutorial-title`,
  tutorialTitleClose: `${PREFIX}-tutorial-title-close`,
  tutorialDesc: `${PREFIX}-tutorial-desc`,
  tutorialOpen: `${PREFIX}-tutorial-open`,
  divider: `${PREFIX}-divider`,
  tutorialControls: `${PREFIX}-tutorial-controls`,
  btnStep: `${PREFIX}-btn-step`,
  btnPreviousStep: `${PREFIX}-btn-previous-step`,
  btnNextStep: `${PREFIX}-btn-next-step`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({
  padding: '0px !important',
  [`&.${classes.tutorialOpen}`]: {
    position: 'relative',
    zIndex: theme.zIndex.drawer + 2,
    [`& .${classes.tutorial}`]: {
      padding: 0
    }
  },
  [`& .${classes.title}`]: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(1)
  },
  [`& .${classes.content}`]: {
    padding: `${theme.spacing(2)} 0 0 0`,
    backgroundColor: '#EFEFEF'
  },
  [`& .${classes.actions}`]: {
    display: 'flex',
    paddingBottom: 0,
    boxShadow: 'inset -1px -3px 7px -4px #CECECE'
  },
  [`& .${classes.action}`]: {
    padding: `0px 2px ${theme.spacing(2)} 2px`,
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center'
  },
  [`& .${classes.tutorialContent}`]: {
    width: '100%'
  },
  [`& .${classes.divider}`]: {
    paddingTop: theme.spacing()
  },
  [`& .${classes.tutorialTitle}`]: {
    position: 'relative',
    fontWeight: 700,
    fontSize: 15,
    padding: `${theme.spacing(3)} ${theme.spacing()} ${theme.spacing()} ${theme.spacing(3)}`
  },
  [`& .${classes.tutorialTitleClose}`]: {
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(3)
  },
  [`& .${classes.tutorialDesc}`]: {
    fontSize: 14,
    fontWeight: 200,
    color: theme.palette.grey[700],
    padding: `0px ${theme.spacing(3)} ${theme.spacing()} ${theme.spacing(3)}`
  },
  [`& .${classes.tutorialControls}`]: {
    padding: theme.spacing(2)
  },
  [`& .${classes.actionHighlighted}`]: {
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      bottom: -11,
      width: 10,
      height: 10,
      transform: 'translateY(-50%) rotate(45deg)',
      boxShadow: '0px -20px 20px 0px #CECECE',
      zIndex: 0,
      backgroundColor: theme.palette.common.white
    },
    '& .MuiButton-root': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  },
  [`& .${classes.btnStep}`]: {
    borderRadius: 3
  }
}));

export interface PlatformWidgetAction {
  /**
   * Render action to be inserted
   */
  render: React.ReactNode;
  /**
   * Title for tutorial
   */
  title: React.ReactNode | string;
  /**
   * Content for tutorial
   */
  content: React.ReactNode | string;
}

export interface PlatformWidgetProps extends VirtualScrollerItemProps {
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  title?: React.ReactNode | null;
  /**
   * Actions to be inserted before
   */
  startActions?: PlatformWidgetAction[];
  /**
   * Actions to be inserted after
   */
  endActions?: PlatformWidgetAction[];
  /**
   * Hide actions
   */
  hideHubAction?: boolean;
  hideConsoleAction?: boolean;
  hideModerationAction?: boolean;
  hideContactUsAction?: boolean;
  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS PlatformWidget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a widget containing the links that allow users and moderators to handle their application content.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Platform)

 #### Import

 ```jsx
 import {PlatformWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPlatformWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPlatformWidget-root|Styles applied to the root element.|
 |title|.SCPlatformWidget-title|Styles applied to the title element.|
 |actions|.SCPlatformWidget-actions|Styles applied to the actions container.|
 |action|.SCPlatformWidget-action|Styles applied to the single action element.|
 |actionHighlighted|.SCPlatformWidget-action-highlighted|Styles applied to the action highlighted.|
 |tutorial|.SCPlatformWidget-tutorial|Styles applied to the tutorial element.|
 |tutorialContent|.SCPlatformWidget-tutorial-content|Styles applied to the content of the tutorial element.|
 |tutorialTitle|.SCPlatformWidget-tutorial-title|Styles applied to the title element of the tutorial.|
 |tutorialTitleClose|.SCPlatformWidget-tutorial-title-close|Styles applied to the close button of the title in the tutorial.|
 |tutorialDesc|.SCPlatformWidget-tutorial-desc|Styles applied to the tutorial description element.|
 |tutorialOpen|.SCPlatformWidget-tutorial-open|Styles applied to the tutorial element when is active.|
 |divider|.SCPlatformWidget-divider|Styles applied to the divider element in the tutorial container.|
 |tutorialControls|.SCPlatformWidget-tutorial-controls|Styles applied to the tutorial bottom controls.|
 |btnStep|.SCPlatformWidget-btn-step|Styles applied to the button next/previous/skip/close of the tutorial controls.|
 |btnPreviousStep|.SCPlatformWidget-btn-previous-step|Styles applied to the button previous element of the tutorial controls.|
 |btnNextStep|.SCPlatformWidget-btn-next-step|Styles applied to the button next element of the tutorial controls.|

 *
 * @param inProps
 */
export default function PlatformWidget(inProps: PlatformWidgetProps): JSX.Element {
  // PROPS
  const props: PlatformWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    autoHide,
    className,
    title = null,
    startActions = [],
    endActions = [],
    hideConsoleAction = false,
    hideModerationAction = false,
    hideHubAction = false,
    hideContactUsAction = false,
    ...rest
  } = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [tutorialIndex, setTutorialIndex] = useState<number>(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  // CONST
  const isAdmin = useMemo(() => UserUtils.isAdmin(scUserContext.user), [scUserContext.user]);
  const isEditor = useMemo(() => UserUtils.isEditor(scUserContext.user), [scUserContext.user]);
  const isModerator = useMemo(() => UserUtils.isModerator(scUserContext.user), [scUserContext.user]);
  const isStage = scContext.settings.portal.includes('stage');
  const actions = [
    ...startActions,
    ...((isAdmin || isEditor) && !hideConsoleAction
      ? [
          {
            render: (
              <Grid item xs="auto">
                <Button variant="outlined" size="small" onClick={() => fetchPlatform('')}>
                  <FormattedMessage id="ui.platformWidget.adm" defaultMessage="ui.platformWidget.adm" />
                </Button>
              </Grid>
            ),
            title: <FormattedMessage id="ui.platformWidget.adm" defaultMessage="ui.platformWidget.adm" />,
            content: <FormattedMessage id="ui.platformWidget.adm.desc" defaultMessage="ui.platformWidget.adm.desc" />
          }
        ]
      : []),
    ...((isAdmin || isModerator) && !hideModerationAction
      ? [
          {
            render: (
              <Button variant="outlined" size="small" onClick={() => fetchPlatform('/moderation/flags/')}>
                <FormattedMessage id="ui.platformWidget.mod" defaultMessage="ui.platformWidget.mod" />
              </Button>
            ),
            title: <FormattedMessage id="ui.platformWidget.mod" defaultMessage="ui.platformWidget.mod" />,
            content: <FormattedMessage id="ui.platformWidget.mod.desc" defaultMessage="ui.platformWidget.mod.desc" />
          }
        ]
      : []),
    ...(isAdmin && !hideHubAction
      ? [
          {
            render: (
              <Button variant="outlined" size="small" component={Link} to={isStage ? HUB_STAGE : HUB_PROD} target="_blank">
                <FormattedMessage id="ui.platformWidget.hub" defaultMessage="ui.platformWidget.hub" />
              </Button>
            ),
            title: <FormattedMessage id="ui.platformWidget.hub" defaultMessage="ui.platformWidget.hub" />,
            content: <FormattedMessage id="ui.platformWidget.hub.desc" defaultMessage="ui.platformWidget.hub.desc" />
          }
        ]
      : []),
    ...(!hideContactUsAction
      ? [
          {
            render: (
              <Button variant="outlined" size="small" component={Link} to={isStage ? CONTACT_STAGE : CONTACT_PROD} target="_blank">
                <FormattedMessage id="ui.platformWidget.contactUs" defaultMessage="ui.platformWidget.contactUs" />
              </Button>
            ),
            title: <FormattedMessage id="ui.platformWidget.contactUs" defaultMessage="ui.platformWidget.contactUs" />,
            content: <FormattedMessage id="ui.platformWidget.contactUs.desc" defaultMessage="ui.platformWidget.contactUs.desc" />
          }
        ]
      : []),
    ...endActions
  ];

  /**
   * Handle open tutorial
   */
  const handleOpenTutorial = useCallback(() => {
    setTutorialIndex(0);
    setIsTutorialOpen(true);
  }, [setTutorialIndex, setIsTutorialOpen]);

  /**
   * Handle close tutorial
   */
  const handleCloseTutorial = useCallback(() => {
    setIsTutorialOpen(false);
    setTutorialIndex(0);
  }, [setIsTutorialOpen, setTutorialIndex]);

  /**
   * Handle next step tutorial
   */
  const handlePrevious = useCallback(() => {
    if (tutorialIndex > 0) {
      setTutorialIndex((prev) => prev - 1);
    } else {
      handleCloseTutorial();
    }
  }, [tutorialIndex, setTutorialIndex, handleCloseTutorial]);

  /**
   * Handle next step tutorial
   */
  const handleNext = useCallback(() => {
    if (tutorialIndex < actions.length - 1) {
      setTutorialIndex((prev) => prev + 1);
    } else {
      handleCloseTutorial();
    }
  }, [actions, tutorialIndex, setTutorialIndex, handleCloseTutorial]);

  /**
   * Fetches platform url
   */
  function fetchPlatform(query: string) {
    http
      .request({
        url: Endpoints.Platform.url(),
        method: Endpoints.Platform.method,
        params: {
          next: query
        }
      })
      .then((res: HttpResponse<any>) => {
        const platformUrl = res.data.platform_url;
        window.open(platformUrl, '_blank').focus();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Render tutorial
   */
  const tutorial = (
    <Grid container spacing={isAdmin ? 1 : 3} justifyContent="center" className={classes.tutorial}>
      {!isTutorialOpen && (
        <Grid item xs="auto" alignItems="center" justifyContent="center">
          <IconButton size="medium" onClick={handleOpenTutorial}>
            <Icon>info</Icon>
          </IconButton>
        </Grid>
      )}
      <Collapse in={isTutorialOpen}>
        {isTutorialOpen && (
          <Grid item xs="auto" className={classes.tutorialContent}>
            <Typography variant={'body2'} className={classes.tutorialTitle} component={'div'}>
              <Grow in timeout={1000}>
                <span>{actions[tutorialIndex].title}</span>
              </Grow>
              <IconButton size={'small'} className={classes.tutorialTitleClose} onClick={handleCloseTutorial}>
                <Icon>close</Icon>
              </IconButton>
            </Typography>
            <Grow in timeout={1200}>
              <Typography variant={'body2'} className={classes.tutorialDesc}>
                {actions[tutorialIndex].content}
              </Typography>
            </Grow>
            <Divider className={classes.divider} />
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className={classes.tutorialControls}>
              <Button variant="text" size="small" onClick={handlePrevious} className={classNames(classes.btnStep, classes.btnPreviousStep)}>
                {tutorialIndex === 0 ? (
                  <FormattedMessage id="ui.platformWidget.tutorial.skip" defaultMessage="ui.platformWidget.tutorial.skip" />
                ) : (
                  <FormattedMessage id="ui.platformWidget.tutorial.previous" defaultMessage="ui.platformWidget.tutorial.previous" />
                )}
              </Button>
              <Typography component={'div'}>
                {tutorialIndex + 1}/{actions.length}
              </Typography>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={handleNext}
                className={classNames(classes.btnStep, classes.btnNextStep)}>
                {tutorialIndex === actions.length - 1 ? (
                  <FormattedMessage id="ui.platformWidget.tutorial.close" defaultMessage="ui.platformWidget.tutorial.close" />
                ) : (
                  <FormattedMessage id="ui.platformWidget.tutorial.next" defaultMessage="ui.platformWidget.tutorial.next" />
                )}
              </Button>
            </Stack>
          </Grid>
        )}
      </Collapse>
    </Grid>
  );

  /**
   * Renders platform card
   */
  const content = (
    <Grid container spacing={isAdmin ? 1 : 3} justifyContent="center" className={classes.content}>
      <Grid item xs={12}>
        {title ? (
          title
        ) : (
          <Box className={classes.title}>
            <Tooltip title={<FormattedMessage id="ui.platformWidget.title.tooltip" defaultMessage="ui.platformWidget.title.tooltip" />}>
              <img src={LogoPlaceholder} alt="logo" />
            </Tooltip>
          </Box>
        )}
      </Grid>

      <Grid item xs={12} className={classes.actions}>
        <Grid item xs={1} className={classes.action}></Grid>
        {actions.map((a: PlatformWidgetAction, i: number) => {
          return (
            <Grid item xs="auto" className={classNames(classes.action, {[classes.actionHighlighted]: tutorialIndex === i && isTutorialOpen})}>
              {a.render}
            </Grid>
          );
        })}
        <Grid item xs={1} className={classes.action}></Grid>
      </Grid>
    </Grid>
  );

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide && scUserContext?.user?.role) {
    return (
      <>
        <Root className={classNames(classes.root, className, {[classes.tutorialOpen]: isTutorialOpen})} {...rest}>
          {content}
          {tutorial}
        </Root>
        <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open={isTutorialOpen} onClick={handleCloseTutorial} />
      </>
    );
  }
  return <HiddenPlaceholder />;
}
