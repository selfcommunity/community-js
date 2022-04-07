import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {TextField, Typography, Box, Avatar, Button, Input, CardContent, Alert, FormGroup} from '@mui/material';
import {
  Link,
  SCContextType,
  SCIncubatorType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCContext,
  useSCRouting,
  useSCUser
} from '@selfcommunity/core';
import BaseDialog from '../../shared/BaseDialog';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';
import Incubator, {IncubatorProps} from '../Incubator';
import Widget from '../Widget';
import {TwitterShareButton, LinkedinShareButton, TwitterIcon, LinkedinIcon} from 'react-share';

const messages = defineMessages({
  intro: {
    id: 'ui.incubatorDetail.intro',
    defaultMessage: 'ui.incubatorDetail.intro'
  }
});

const PREFIX = 'SCIncubatorDetail';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  title: `${PREFIX}-title`,
  author: `${PREFIX}-author`,
  shareCard: `${PREFIX}-share-card`,
  copyUrlForm: `${PREFIX}-copy-url-form`,
  copyButton: `${PREFIX}-copy-button`,
  copyText: `${PREFIX}-copy-text`,
  shareSection: `${PREFIX}-share-section`,
  socialShareButton: `${PREFIX}-social-share-button`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  margin: 2,
  [theme.breakpoints.down(500)]: {
    minWidth: 300
  },
  [`& .${classes.avatar}`]: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(3)
  },
  [`& .${classes.title}`]: {
    fontSize: '1rem',
    whiteSpace: 'pre-line'
  },
  [`& .${classes.copyUrlForm}`]: {
    flexDirection: 'row',
    marginBottom: theme.spacing(1)
  },
  [`& .${classes.copyButton}`]: {
    borderRadius: 0
  },
  [`& .${classes.copyText}`]: {
    width: '80%',
    '& .MuiInputBase-root': {
      borderRadius: 0,
      '& .MuiOutlinedInput-input': {
        padding: theme.spacing(1)
      }
    }
  },
  [`& .${classes.shareSection}`]: {
    marginTop: theme.spacing(1)
  },
  [`& .${classes.socialShareButton}`]: {
    marginRight: theme.spacing(1)
  }
}));

export interface IncubatorDetailProps {
  /**
   * The incubator obj
   * @default null
   */
  incubator?: SCIncubatorType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Opens dialog
   * @default false
   */
  open: boolean;
  /**
   * On dialog close callback function
   * @default null
   */
  onClose?: () => void;
  /**
   * Props to spread to single incubator object
   * @default {}
   */
  IncubatorProps?: IncubatorProps;
  /**
   * Callback fired on subscribe action to update count in main list
   * @param incubator
   */
  onSubscriptionsUpdate?: (incubator) => any;
}
/**
 * > API documentation for the Community-UI Incubator Detail component. Learn about the available props and the CSS API.
 *
 * #### Import
 ```jsx
 import {IncubatorDetail} from '@selfcommunity/ui';
 ```
 #### Component Name
 The name `SCIncubatorDetail` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubatorDetail-root|Styles applied to the root element.|
 |avatar|.SCIncubatorDetail-avatar|Styles applied to the avatar element.|
 |title|.SCIncubatorDetail-title|Styles applied to the title element.|
 |author|.SCIncubatorDetail-author|Styles applied to the author element.|
 |shareCard|.SCIncubatorDetail-share-card|Styles applied to the  section card.|
 |copyUrlForm|.SCIncubatorDetail-copy-url-form|Styles applied to the url copy section.|
 |copyButton|.SCIncubatorDetail-copy-button|Styles applied to the copy button element.|
 |copyText|.SCIncubatorDetail-copy-text|Styles applied to the text copy element.|
 |shareSection|.SCIncubatorDetail-share-section|Styles applied to the social share section.|
 |socialShareButton|.SCIncubatorDetail-social-share-button|Styles applied to the social share button.|
* @param inProps
*/
export default function IncubatorDetail(inProps: IncubatorDetailProps): JSX.Element {
  // PROPS
  const props: IncubatorDetailProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {incubator, className, open, onClose, IncubatorProps = {}, onSubscriptionsUpdate, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scContext: SCContextType = useSCContext();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const portal = scContext.settings.portal + scRoutingContext.url(SCRoutes.INCUBATOR_ROUTE_NAME, incubator);

  // STATE
  const [alert, setAlert] = useState<boolean>(false);

  // INTL
  const intl = useIntl();

  // HANDLERS

  const copy = async () => {
    await navigator.clipboard.writeText(portal);
    setAlert(true);
  };

  /**
   * Renders root element
   */
  return (
    <Root
      title={
        <>
          <Avatar className={classes.avatar} alt={incubator.user.avatar} src={incubator.user.avatar} />
          <Box>
            <Typography className={classes.title}>{`${intl.formatMessage(messages.intro, {name: incubator.name})}`} </Typography>
            <Typography component={'span'}>
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, incubator.user)}>@{incubator.user.username}</Link>
            </Typography>
          </Box>
        </>
      }
      open={open}
      onClose={onClose}
      className={classNames(classes.root, className)}
      {...rest}>
      <Box>
        <Incubator elevation={0} incubator={incubator} subscribeButtonProps={{onSubscribe: onSubscriptionsUpdate}} {...IncubatorProps} />
        <Widget elevation={1} className={classes.shareCard}>
          <CardContent>
            <Typography variant={'h6'}>
              <FormattedMessage id="ui.incubatorDetail.shareSection.title" defaultMessage="ui.incubatorDetail.shareSection.title" />
            </Typography>
            <Typography variant={'subtitle1'}>
              <FormattedMessage id="ui.incubatorDetail.shareSection.share" defaultMessage="ui.incubatorDetail.shareSection.share" />
            </Typography>
            <FormGroup className={classes.copyUrlForm}>
              <TextField className={classes.copyText} variant="outlined" value={portal} />
              <Button className={classes.copyButton} variant="contained" onClick={copy}>
                <FormattedMessage id="ui.incubatorDetail.shareSection.button.copy" defaultMessage="ui.incubatorDetail.shareSection.button.copy" />
              </Button>
            </FormGroup>
            {alert && (
              <Alert onClose={() => setAlert(false)}>
                <FormattedMessage id="ui.incubatorDetail.shareSection.copied" defaultMessage="ui.incubatorDetail.shareSection.copied" />
              </Alert>
            )}
            <Typography variant={'subtitle2'}>
              <FormattedMessage id="ui.incubatorDetail.shareSection.invite" defaultMessage="ui.incubatorDetail.shareSection.invite" />
            </Typography>
            <Box className={classes.shareSection}>
              <LinkedinShareButton url={portal} className={classes.socialShareButton}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <TwitterShareButton url={portal}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            </Box>
          </CardContent>
        </Widget>
      </Box>
    </Root>
  );
}
