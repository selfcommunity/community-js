import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {PREFIX} from '../../constants';
import {Button, CardMedia, Icon, Tab, Tabs, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import Ios from '../../../../assets/onBoarding/Ios';
import Android from '../../../../assets/onBoarding/Android';
import {SCOnBoardingStepStatusType, SCStepType} from '@selfcommunity/types';

const classes = {
  root: `${PREFIX}-app-root`,
  title: `${PREFIX}-app-title`,
  tabs: `${PREFIX}-app-tabs`,
  tabContent: `${PREFIX}-app-tab-content`,
  summary: `${PREFIX}-app-summary`,
  image: `${PREFIX}-app-image`,
  action: `${PREFIX}-app-action`,
  button: `${PREFIX}-app-button`
};

export interface AppProps {
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
   * Callback triggered on complete action click
   * @default null
   */
  onCompleteAction: () => void;
}

const Root = styled(Box, {
  name: PREFIX,
  slot: 'AppRoot'
})(() => ({}));
export default function App(inProps: AppProps) {
  // PROPS
  const props: AppProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  //PROPS
  const {className, step, onCompleteAction} = props;

  // STATE
  const [tab, setTab] = useState<number>(0);

  // HANDLERS

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Root className={classNames(classes.root, className)}>
      <Typography variant="h4" className={classes.title}>
        <FormattedMessage id="ui.onBoardingWidget.step.app.title" defaultMessage="ui.onBoardingWidget.step.app.title" />
      </Typography>
      <Typography className={classes.summary}>
        <FormattedMessage id="ui.onBoardingWidget.step.app.summary" defaultMessage="ui.onBoardingWidget.step.app.summary" />
      </Typography>
      <Tabs className={classes.tabs} value={tab} onChange={handleChange} centered variant="fullWidth" indicatorColor="primary">
        <Tab label={<FormattedMessage id="ui.onBoardingWidget.step.app.tab.ios" defaultMessage="ui.onBoardingWidget.step.app.tab.ios" />} />
        <Tab label={<FormattedMessage id="ui.onBoardingWidget.step.app.tab.android" defaultMessage="ui.onBoardingWidget.step.app.tab.android" />} />
      </Tabs>
      <Box className={classes.tabContent}>
        {tab === 0 && (
          <>
            <Typography className={classes.summary}>
              <FormattedMessage id="ui.onBoardingWidget.step.app.ios" defaultMessage="ui.onBoardingWidget.step.app.ios" />
            </Typography>
            <Typography className={classes.summary}>
              <FormattedMessage
                id="ui.onBoardingWidget.step.app.ios.a"
                defaultMessage="ui.onBoardingWidget.step.app.ios.a"
                values={{
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  icon: (...chunks) => <Icon fontSize="medium">{chunks}</Icon>,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  b: (...chunks) => <strong>{chunks}</strong>
                }}
              />
            </Typography>
            <Typography className={classes.summary}>
              <FormattedMessage
                id="ui.onBoardingWidget.step.app.ios.b"
                defaultMessage="ui.onBoardingWidget.step.app.ios.b"
                values={{
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  icon: (...chunks) => <Icon fontSize="medium">{chunks}</Icon>,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  b: (...chunks) => <strong>{chunks}</strong>
                }}
              />
            </Typography>
            <CardMedia className={classes.image} component="div">
              <Ios />
            </CardMedia>
          </>
        )}
        {tab === 1 && (
          <>
            <Typography className={classes.summary}>
              <FormattedMessage id="ui.onBoardingWidget.step.app.android" defaultMessage="ui.onBoardingWidget.step.app.android" />
            </Typography>
            <Typography className={classes.summary}>
              <FormattedMessage
                id="ui.onBoardingWidget.step.app.android.a"
                defaultMessage="ui.onBoardingWidget.step.app.android.a"
                values={{
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  icon: (...chunks) => <Icon fontSize="medium">{chunks}</Icon>,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  b: (...chunks) => <strong>{chunks}</strong>
                }}
              />
            </Typography>
            <Typography className={classes.summary}>
              <FormattedMessage
                id="ui.onBoardingWidget.step.app.android.b"
                defaultMessage="ui.onBoardingWidget.step.app.android.b"
                values={{
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  icon: (...chunks) => <Icon fontSize="medium">{chunks}</Icon>,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  b: (...chunks) => <strong>{chunks}</strong>
                }}
              />
            </Typography>
            <CardMedia className={classes.image} component="div">
              <Android />
            </CardMedia>
          </>
        )}
        <Button
          className={classes.button}
          size="small"
          variant="outlined"
          color="secondary"
          onClick={onCompleteAction}
          disabled={step?.status === SCOnBoardingStepStatusType.COMPLETED || step?.status === SCOnBoardingStepStatusType.IN_PROGRESS}>
          Ok!
        </Button>
      </Box>
    </Root>
  );
}
