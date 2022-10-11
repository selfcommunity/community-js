import React, {forwardRef, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import {Alert, Checkbox, Button, DialogProps, FormControlLabel, Typography, CardProps} from '@mui/material';
import classNames from 'classnames';
import Icon from '@mui/material/Icon';
import {LoadingButton} from '@mui/lab';
import moment from 'moment';
import {DataPortabilityService, LegalPageService, UserService} from '@selfcommunity/api-services';
import {SCDataPortabilityType, SCLegalPageType} from '@selfcommunity/types';
import {arraysEqual, capitalize, Logger} from '@selfcommunity/utils';
import {SCPreferencesContextType, useSCPreferences, SCUserContextType, SCUserContext, SCPreferences} from '@selfcommunity/react-core';
import ConsentSolutionSwitch from '../../shared/ConsentSolutionSwitch';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import {LEGAL_POLICIES} from './../../constants/LegalPolicies';
import ConsentSolutionSkeleton from './Skeleton';
import {getDocumentBody, isDocumentApproved, isEmptyDocumentBody} from '../../utils/legalPages';
import {FormattedMessage, FormattedDate, FormattedTime, defineMessages, useIntl} from 'react-intl';
import {elementScrollTo} from 'seamless-scroll-polyfill';

const PREFIX = 'SCConsentSolution';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  titleBack: `${PREFIX}-title-back`,
  content: `${PREFIX}-content`,
  consent: `${PREFIX}-consent`,
  consentSwitch: `${PREFIX}-consent-switch`,
  actions: `${PREFIX}-actions`,
  backButton: `${PREFIX}-back-button`,
  nextButton: `${PREFIX}-next-button`,
  closeButton: `${PREFIX}-close-button`,
  confirmDeleteAccountButton: `${PREFIX}-confirm-delete-account-button`,
  logoutAccountButton: `${PREFIX}-logout-account-button`,
  deleteAccountButton: `${PREFIX}-delete-account-button`,
  createDataPortabilityButton: `${PREFIX}-create-data-portability-button`,
  downloadDataPortabilityButton: `${PREFIX}-download-data-portability-button`,
  dataPortabilityCheck: `${PREFIX}-download-data-portability-check`,
  alertAcceptDocument: `${PREFIX}-alert-accept-document`,
  acceptConditions: `${PREFIX}-accept-conditions`
};

const Root = styled(Dialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.title}`]: {
    display: 'flex',
    justifyContent: 'center',
    fontWeight: 800,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem'
    }
  },
  [`& .${classes.titleBack}`]: {
    display: 'flex',
    justifyContent: 'left'
  },
  [`& .${classes.content}`]: {
    padding: theme.spacing(2),
    overflowX: 'hidden',
    fontSize: '0.8rem',
    [theme.breakpoints.down('sm')]: {
      padding: 12,
      '& h6': {
        fontSize: '0.8rem'
      },
      '& span, p, li': {
        fontSize: '0.7rem'
      },
      '& li': {
        fontSize: '0.7rem'
      },
      '& button': {
        fontSize: '0.6rem'
      }
    }
  },
  [`& .${classes.consent}`]: {
    borderTop: 0,
    overflowY: 'visible',
    [theme.breakpoints.down('sm')]: {
      paddingTop: 5,
      paddingBottom: 5
    }
  },
  [`& .${classes.consentSwitch}`]: {
    margin: `${theme.spacing()} 3px`,
    '& > span:first-of-type': {
      marginRight: 10
    },
    [theme.breakpoints.down('sm')]: {
      '.MuiFormControlLabel-label': {
        fontSize: '0.7rem'
      }
    }
  },
  [`& .${classes.deleteAccountButton}`]: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  [`& .${classes.confirmDeleteAccountButton}`]: {
    color: '#FFF !important',
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing()
  },
  [`& .${classes.logoutAccountButton}`]: {
    marginBottom: theme.spacing()
  },
  [`& .${classes.createDataPortabilityButton}`]: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing()
  },
  [`& .${classes.downloadDataPortabilityButton}`]: {
    marginBottom: theme.spacing()
  },
  [`& .${classes.alertAcceptDocument}`]: {
    padding: theme.spacing(),
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.7rem',
      padding: 5
    }
  },
  [`& .${classes.acceptConditions}`]: {
    fontSize: '0.8rem',
    fontWeight: 300,
    color: theme.palette.grey['A400'],
    padding: `${theme.spacing()} ${theme.spacing()}`,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.6rem'
    }
  }
}));

/**
 * Translations
 */
const messages = defineMessages({
  createDpSectionInfo: {
    id: 'ui.consentSolution.createDpSectionInfo',
    defaultMessage: 'ui.consentSolution.createDpSectionInfo'
  },
  deleteAccountDpSectionInfo: {
    id: 'ui.consentSolution.deleteAccountDpSectionInfo',
    defaultMessage: 'ui.consentSolution.deleteAccountDpSectionInfo'
  },
  createDpSectionTitle: {
    id: 'ui.consentSolution.createDpSectionTitle',
    defaultMessage: 'ui.consentSolution.createDpSectionTitle'
  },
  createDpSectionGeneratedAt: {
    id: 'ui.consentSolution.createDpSectionGeneratedAt',
    defaultMessage: 'ui.consentSolution.createDpSectionGeneratedAt'
  },
  deleteAccountDpSectionTitle: {
    id: 'ui.consentSolution.deleteAccountDpSectionTitle',
    defaultMessage: 'ui.consentSolution.deleteAccountDpSectionTitle'
  }
});

export interface ConsentSolutionProps extends Pick<DialogProps, Exclude<keyof DialogProps, 'open'>> {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Open dialog
   * @default true
   */
  open?: boolean;

  /**
   * Filter policies
   */
  legalPolicies?: string[];

  /**
   * Callback when logout rejecting policy document
   */
  onLogout?: () => void;

  /**
   * Callback when delete account rejecting policy document
   */
  onDeleteAccount?: () => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * Dialog default transition
 */
const DialogTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Dialog views
 */
export const ACCEPT_VIEW = 'accept';
export const REJECTION_VIEW = 'rejection';
export const CONFIRM_DELETE_ACCOUNT = 'delete_account';

/**
 *> API documentation for the Community-JS ConsentSolution component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {ConsentSolution} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCConsentSolution` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCConsentSolution-root|Styles applied to the root element.|
 |title|.SCConsentSolution-title|Styles applied to the title element.|
 |titleBack|.SCConsentSolution-title-back|Styles applied to the title with the back button element.|
 |content|.SCConsentSolution-content|Styles applied to the content element section.|
 |consent|.SCConsentSolution-consent|Styles applied to the consent element section.|
 |consentSwitch|.SCConsentSolution-consent-switch|Styles applied to the switch element. |
 |alertAcceptDocument|.SCConsentSolution-alert-accept-document|Styles applied to the alert box in the consent section.|nt.|
 |actions|.SCConsentSolution-actions|Styles applied to the actions section.|
 |backButton|.SCConsentSolution-back-button|Styles applied to the back button in the title and action sections.|
 |nextButton|.SCConsentSolution-next-button|Styles applied to the next button in the actions section.|
 |closeButton|.SCConsentSolution-close-button|Styles applied to the close button in the actions section.|
 |confirmDeleteAccountButton|.SCConsentSolution-confirm-delete-account-button|Styles applied to the confirm delete account button in the rejection section.|
 |logoutAccountButton|.SCConsentSolution-logout-account-button|Styles applied to the exit account button in the rejection section.|
 |deleteAccountButton|.SCConsentSolution-delete-account-button|Styles applied to the delete account button in the rejection section.|
 |createDataPortabilityButton|.SCConsentSolution-create-data-portability-button|Styles applied to the create data portability button in the rejection section.|
 |downloadDataPortabilityButton|.SCConsentSolution-download-data-portability-button|Styles applied to the download data portability button in the rejection section.|
 |dataPortabilityCheck|.SCConsentSolution-data-portability-check|Styles applied to the checkbox in the rejection section.|

 * @param inProps
 */
export default function ConsentSolution(inProps: ConsentSolutionProps): JSX.Element {
  // PROPS
  const props: ConsentSolutionProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, open = true, onClose, legalPolicies = LEGAL_POLICIES, onLogout, onDeleteAccount, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const communityName = useMemo(() => {
    return scPreferences.preferences && SCPreferences.TEXT_APPLICATION_NAME in scPreferences.preferences
      ? scPreferences.preferences[SCPreferences.TEXT_APPLICATION_NAME].value
      : null;
  }, [scPreferences.preferences]);

  // STATE
  const [ready, setReady] = React.useState(false);
  const [_view, setView] = useState<string>(ACCEPT_VIEW);

  const [documents, setDocuments] = useState<SCLegalPageType[]>([]);
  const [currentDocument, setCurrentDocument] = useState<number>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [loadingAck, setLoadingAck] = useState<boolean>(false);
  const [rejected, setRejected] = useState<boolean>(false);

  const [dataPortability, setDataPortability] = useState<SCDataPortabilityType>(null);
  const [dataPortabilityChecked, setDataPortabilityChecked] = useState<boolean>(false);
  const [loadingDataPortability, setLoadingDataPortability] = useState<boolean>(false);
  const [downloadingDataPortability, setDownloadingDataPortability] = useState<boolean>(false);

  const [loadingDeleteAccount, setLoadingDeleteAccount] = useState<boolean>(false);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const doc = documents[currentDocument];

  // REFS
  const contentDialog = useRef<HTMLHeadingElement>(null);

  // INTL
  const intl = useIntl();

  /**
   * Handle close dialog
   */
  const handleClose = (e, s) => {
    if (doc.ack && doc.ack.accepted_at) {
      setReady(false);
      // Call dialog callback if exist
      onClose && onClose(e, s);
    }
  };

  /**
   * Handle close dialog
   */
  const handleNext = () => {
    if (doc.ack && doc.ack.accepted_at) {
      contentDialog.current && elementScrollTo(contentDialog.current, {top: 0, behavior: 'smooth'});
      setCurrentDocument((prev) => prev + 1);
    } else {
      setRejected(true);
    }
  };

  /**
   * Handle accept (ack a policy document)
   */
  const handleChangeConsent = (accept) => {
    setLoadingAck(true);
    let legalPages = [...documents];
    LegalPageService.ackLegalPage(legalPages[currentDocument].id, Number(accept).toString())
      .then((ack) => {
        if (accept) {
          legalPages[currentDocument].ack = ack;
          setRejected(false);
        } else {
          legalPages[currentDocument].ack.accepted_at = null;
          setRejected(true);
        }
        setLoadingAck(false);
        setDocuments(legalPages);
      })
      .catch((_error) => {
        setLoadingAck(false);
        Logger.error(SCOPE_SC_UI, _error);
      });
  };

  /**
   * Handle create data portability
   */
  const handleCreateDataPortabilityFile = () => {
    setLoadingDataPortability(true);
    DataPortabilityService.generateDataPortability()
      .then((res) => {
        if (res) {
          setDataPortability(dataPortability);
        }
      })
      .catch((_error) => {
        Logger.error(SCOPE_SC_UI, _error);
      });
  };

  /**
   * Handle download data portability
   */
  const handleDownloadDataPortabilityFile = () => {
    setDownloadingDataPortability(true);
    DataPortabilityService.downloadDataPortability()
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res], {type: 'application/zip'}));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `${scUserContext.user.username}_${intl.formatDate(moment().format(), {year: 'numeric', month: 'numeric', day: 'numeric'})}.zip`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setDownloadingDataPortability(false);
      })
      .catch((_error) => {
        setDownloadingDataPortability(false);
        Logger.error(SCOPE_SC_UI, _error);
      });
  };

  /**
   * Handle confirm delete account
   */
  const handleConfirmDeleteAccount = () => {
    setLoadingDeleteAccount(true);
    UserService.userDelete(scUserContext.user.id, 0)
      .then(() => {
        setLoadingDeleteAccount(false);
        onDeleteAccount && onDeleteAccount();
        handleLogout();
      })
      .catch((_error) => {
        setLoadingDeleteAccount(false);
        Logger.error(SCOPE_SC_UI, _error);
      });
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    scUserContext.logout();
    onLogout && onLogout();
  };

  /**
   * Fetch tec and privacy document status
   */
  const fetchLegalPages = () => {
    setLoading(true);
    return LegalPageService.getAllLastRevisionsOfLegalPages()
      .then((documents: SCLegalPageType[]) => {
        let docs = documents.filter((lp) => legalPolicies.filter((p) => lp.name_and_version.startsWith(p)).length > 0);
        // if initial legalPolicies !== LEGAL_POLICIES
        if (arraysEqual(legalPolicies, LEGAL_POLICIES)) {
          docs = docs.filter((d) => !isEmptyDocumentBody(d) && !isDocumentApproved(d));
        }
        setDocuments(docs);
        setLoading(false);
        if (docs.length > 0) {
          setCurrentDocument(0);
          setReady(true);
        }
        Promise.resolve(docs);
      })
      .catch((_error) => {
        Logger.error(SCOPE_SC_UI, _error);
      });
  };

  /**
   * Fetch data portability status
   */
  const fetchDataPortabilityStatus = () => {
    DataPortabilityService.dataPortabilityStatus()
      .then((res) => {
        if (res) {
          if (!res.computing && res.generated_at) {
            setLoadingDataPortability(false);
          }
          setDataPortability(res);
        }
      })
      .catch((_error) => {
        Logger.error(SCOPE_SC_UI, _error);
      });
  };

  /**
   * On mount, fetches legal and custom documents
   */
  useEffect(() => {
    if (!authUserId) {
      return;
    }
    fetchLegalPages();
  }, [authUserId]);

  /**
   * Sync data portability status
   */
  useEffect(() => {
    let interval;
    if (authUserId !== null && ready) {
      fetchDataPortabilityStatus();
      if (_view === REJECTION_VIEW) {
        interval = setInterval(() => {
          fetchDataPortabilityStatus();
        }, 5000);
      }
    }
    return () => interval && clearInterval(interval);
  }, [authUserId, ready, _view]);

  /**
   * Render main view
   */
  const renderMainView: Function = () => {
    if (!doc) {
      return null;
    }
    const isAccept = Boolean(doc.ack !== null && doc.ack.accepted_at);
    return (
      <>
        <DialogTitle className={classes.title}>
          <FormattedMessage
            id="ui.consentSolution.acceptDocumentTitle"
            defaultMessage="ui.consentSolution.acceptDocumentTitle"
            values={{label: doc.label}}
          />
        </DialogTitle>
        <DialogContent className={classes.content} dividers ref={contentDialog}>
          <Typography
            component="div"
            gutterBottom
            dangerouslySetInnerHTML={{
              __html: getDocumentBody(doc)
            }}
          />
        </DialogContent>
        <DialogContent className={classes.consent} dividers>
          <FormControlLabel
            className={classes.consentSwitch}
            control={
              <ConsentSolutionSwitch
                loading={loadingAck}
                disabled={loadingAck}
                checked={isAccept}
                onChange={() => handleChangeConsent(!isAccept)}
                name="consent"
              />
            }
            label={
              <b>
                <FormattedMessage id="ui.consentSolution.consentSwitchLabel" defaultMessage="ui.consentSolution.consentSwitchLabel" />
              </b>
            }
          />
          {rejected ? (
            <Alert severity="error" className={classes.alertAcceptDocument}>
              <FormattedMessage id="ui.consentSolution.deleteAccountAlert" defaultMessage="ui.consentSolution.deleteAccountAlert" />
              <a onClick={() => setView(REJECTION_VIEW)} className={classes.deleteAccountButton}>
                <b>
                  <FormattedMessage id="ui.consentSolution.deleteAccount" defaultMessage="ui.consentSolution.deleteAccount" />
                </b>
              </a>
            </Alert>
          ) : (
            <>
              <Typography variant="body2" className={classes.acceptConditions}>
                <FormattedMessage id="ui.consentSolution.consentSwitchDetail" defaultMessage="ui.consentSolution.consentSwitchDetail" />
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions className={classes.actions}>
          {currentDocument > 0 && (
            <Button size="small" onClick={() => setCurrentDocument((prev) => prev - 1)} className={classes.backButton}>
              <FormattedMessage id="ui.consentSolution.backButton" defaultMessage="ui.consentSolution.backButton" />
            </Button>
          )}
          {currentDocument < documents.length - 1 ? (
            <Button size="small" variant={'outlined'} disabled={!isAccept} onClick={handleNext} className={classes.nextButton}>
              <FormattedMessage id="ui.consentSolution.nextButton" defaultMessage="ui.consentSolution.nextButton" />
            </Button>
          ) : (
            <Button size="small" variant={'outlined'} disabled={!isAccept} onClick={(e) => handleClose(e, null)} className={classes.closeButton}>
              <FormattedMessage id="ui.consentSolution.closeButton" defaultMessage="ui.consentSolution.closeButton" />
            </Button>
          )}
        </DialogActions>
      </>
    );
  };

  /**
   * Render document detail view
   */
  const renderRejectionView: Function = () => {
    const doc = documents[currentDocument];
    if (!doc) {
      return null;
    }
    return (
      <>
        <DialogTitle className={classNames(classes.title, classes.titleBack)}>
          <Button
            size="small"
            variant={'outlined'}
            onClick={() => setView(ACCEPT_VIEW)}
            className={classes.backButton}
            startIcon={<Icon>arrow_back</Icon>}>
            <FormattedMessage id="ui.consentSolution.backButton" defaultMessage="ui.consentSolution.backButton" />
          </Button>
        </DialogTitle>
        <DialogContent className={classes.content} dividers>
          <Typography variant="h6">
            <FormattedMessage
              id="ui.consentSolution.createDpSectionTitle"
              defaultMessage="ui.consentSolution.createDpSectionTitle"
              values={{username: capitalize(scUserContext.user.username)}}
            />
          </Typography>
          <br />
          <Typography variant="body2">
            <FormattedMessage id="ui.consentSolution.deleteAccountTitle" defaultMessage="ui.consentSolution.deleteAccountTitle" />
          </Typography>
          <ul>
            {intl.formatMessage(messages.createDpSectionInfo, {
              li: (chunks) => <li>{chunks}</li>
            })}
          </ul>
          <LoadingButton
            size="small"
            loading={(dataPortability && dataPortability.computing) || loadingDataPortability}
            disabled={dataPortability && (dataPortability.computing || moment().diff(moment(dataPortability.requested_at), 'hours') < 24)}
            loadingPosition="start"
            startIcon={<Icon>copy_all_outlined</Icon>}
            variant="outlined"
            className={classes.createDataPortabilityButton}
            onClick={handleCreateDataPortabilityFile}>
            <FormattedMessage id="ui.consentSolution.createFileButton" defaultMessage="ui.consentSolution.createFileButton" />
          </LoadingButton>
          {dataPortability && !dataPortability.computing && dataPortability.generated_at && (
            <LoadingButton
              size="small"
              loading={downloadingDataPortability}
              loadingPosition="start"
              startIcon={<Icon>cloud_download_outlined</Icon>}
              variant={'outlined'}
              className={classes.downloadDataPortabilityButton}
              onClick={handleDownloadDataPortabilityFile}>
              <FormattedMessage id="ui.consentSolution.downloadFileButton" defaultMessage="ui.consentSolution.downloadFileButton" />
            </LoadingButton>
          )}
          <br />
          {dataPortability && !dataPortability.computing && dataPortability.generated_at && (
            <Typography variant="body2">
              <b>
                {intl.formatMessage(messages.createDpSectionGeneratedAt, {
                  date: <FormattedDate value={dataPortability.requested_at} day="numeric" month="long" year="numeric" />,
                  time: <FormattedTime value={dataPortability.requested_at} />
                })}
              </b>
            </Typography>
          )}
          <br />
          <Typography variant="h6">
            <FormattedMessage
              id="ui.consentSolution.deleteAccountDpSectionTitle"
              defaultMessage="ui.consentSolution.deleteAccountDpSectionTitle"
              values={{username: capitalize(scUserContext.user.username)}}
            />
          </Typography>
          <ul>{intl.formatMessage(messages.deleteAccountDpSectionInfo, {communityName, li: (chunks) => <li>{chunks}</li>})}</ul>
          <FormControlLabel
            control={
              <Checkbox
                className={classes.dataPortabilityCheck}
                checked={dataPortabilityChecked}
                onChange={() => setDataPortabilityChecked((p) => !p)}
              />
            }
            label={
              <FormattedMessage
                id="ui.consentSolution.deleteAccountDpSectionCheckboxLabel"
                defaultMessage="ui.consentSolution.deleteAccountDpSectionCheckboxLabel"
              />
            }
          />
          <br />
          <Button
            size="small"
            startIcon={<Icon>delete_outlined</Icon>}
            disabled={!dataPortabilityChecked}
            variant={'contained'}
            className={classes.confirmDeleteAccountButton}
            onClick={() => setView(CONFIRM_DELETE_ACCOUNT)}>
            <FormattedMessage id="ui.consentSolution.confirmDeleteAccountButton" defaultMessage="ui.consentSolution.confirmDeleteAccountButton" />
          </Button>
          <Button
            size="small"
            variant={'outlined'}
            className={classes.logoutAccountButton}
            startIcon={<Icon>door_back_outlined</Icon>}
            onClick={handleLogout}
            color={'secondary'}>
            <FormattedMessage id="ui.consentSolution.logoutImmediatelyButton" defaultMessage="ui.consentSolution.logoutImmediatelyButton" />
          </Button>
        </DialogContent>
      </>
    );
  };

  /**
   * Render delete account view
   */
  const renderDeleteAccountView: Function = () => {
    return (
      <>
        <DialogTitle className={classNames(classes.title, classes.titleBack)}>
          <Button
            size="small"
            disabled={loadingDeleteAccount}
            variant={'outlined'}
            onClick={() => setView(REJECTION_VIEW)}
            className={classes.backButton}
            startIcon={<Icon>arrow_back</Icon>}>
            <FormattedMessage id="ui.consentSolution.backButton" defaultMessage="ui.consentSolution.backButton" />
          </Button>
        </DialogTitle>
        <DialogContent className={classes.content} dividers>
          <Typography variant="body2">
            <FormattedMessage id="ui.consentSolution.removeAccountTitle" defaultMessage="ui.consentSolution.removeAccountTitle" />
          </Typography>
          <ul>{intl.formatMessage(messages.deleteAccountDpSectionInfo, {communityName, li: (chunks) => <li>{chunks}</li>})}</ul>
          <br />
          <Typography variant="body2">
            <b>
              <FormattedMessage id="ui.consentSolution.removeAccountConfirm" defaultMessage="ui.consentSolution.removeAccountConfirm" />
            </b>
          </Typography>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button size="small" disabled={loadingDeleteAccount} variant={'outlined'} onClick={() => setView(REJECTION_VIEW)}>
            <FormattedMessage id="ui.consentSolution.removeAccountCancelButton" defaultMessage="ui.consentSolution.removeAccountCancelButton" />
          </Button>
          <Button size="small" disabled={loadingDeleteAccount} variant={'outlined'} onClick={handleConfirmDeleteAccount}>
            <FormattedMessage id="ui.consentSolution.removeAccountConfirmButton" defaultMessage="ui.consentSolution.removeAccountConfirmButton" />
          </Button>
        </DialogActions>
      </>
    );
  };

  /**
   * Set content dialog component
   */

  let content: Function = () => null;
  if (ready && doc && !loading) {
    switch (_view) {
      case ACCEPT_VIEW:
        content = renderMainView;
        break;
      case REJECTION_VIEW:
        content = renderRejectionView;
        break;
      case CONFIRM_DELETE_ACCOUNT:
        content = renderDeleteAccountView;
        break;
      default:
        content = renderMainView;
        break;
    }
  } else {
    content = () => <ConsentSolutionSkeleton />;
  }

  /**
   * Renders root object
   */
  return (
    <>
      {open && (
        <Root
          aria-describedby="consent--solution-dialog"
          className={classNames(classes.root, className)}
          TransitionComponent={DialogTransition}
          maxWidth={'md'}
          fullWidth
          open={ready}
          disableEscapeKeyDown
          onClose={handleClose}
          scroll={'paper'}
          {...rest}>
          {content()}
        </Root>
      )}
    </>
  );
}
