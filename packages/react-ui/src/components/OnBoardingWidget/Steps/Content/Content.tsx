import {styled} from '@mui/material/styles';
import {Alert, Button, Icon, Typography, useMediaQuery, useTheme} from '@mui/material';
import Box from '@mui/material/Box';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import {SCContextType, SCLocaleContextType, SCThemeType, SCUserContextType, useSCContext, useSCLocale, useSCUser} from '@selfcommunity/react-core';
import {PREFIX} from '../../constants';
import {FormattedMessage} from 'react-intl';
import {OnBoardingService, OnBoardingStep} from '@selfcommunity/api-services';
import {SCOPE_SC_UI} from '../../../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {SCOnBoardingStepStatusType, SCStepType} from '@selfcommunity/types';

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
  onSuccess?: (res: any) => void;

  /**
   * Action component to display after success message
   * */
  successAction?: React.ReactNode;
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
  const {className, step, onSuccess, successAction = null} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [isSucceed, setIsSucceed] = useState<boolean>(false);
  const [hover, setHover] = useState(false);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // HANDLERS

  const handleContentCreation = async () => {
    await OnBoardingService.startAStep(OnBoardingStep.CONTENTS)
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
      <Typography variant="h4" className={classes.title}>
        <FormattedMessage id="ui.onBoardingWidget.contents" defaultMessage="ui.onBoardingWidget.contents" />
      </Typography>
      <Typography className={classes.summary}>
        <FormattedMessage id="ui.onBoardingWidget.step.content.summary" defaultMessage="ui.onBoardingWidget.step.content.summary" />
      </Typography>
      <Box component="span" className={classes.action}>
        {step?.status === SCOnBoardingStepStatusType.COMPLETED ? (
          <Alert severity="success">
            <FormattedMessage id="ui.onBoardingWidget.step.content.success" defaultMessage="ui.onBoardingWidget.step.content.success" />{' '}
          </Alert>
        ) : (
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={handleContentCreation}
            endIcon={<Icon>{hover ? 'ai_stars' : 'magic_wand'}</Icon>}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={step?.status === SCOnBoardingStepStatusType.COMPLETED || step?.status === SCOnBoardingStepStatusType.IN_PROGRESS}>
            <FormattedMessage defaultMessage="ui.onBoardingWidget.step.content.button" id="ui.onBoardingWidget.step.content.button" />
          </Button>
        )}
      </Box>
    </Root>
  );
}
