import React, {useContext, useEffect, useState} from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import {Box, BoxProps, Typography} from '@mui/material';
import classNames from 'classnames';
import Icon from '@mui/material/Icon';
import {LoadingButton} from '@mui/lab';
import moment from 'moment';
import {DataPortabilityService} from '@selfcommunity/api-services';
import {SCDataPortabilityType} from '@selfcommunity/types';
import {capitalize, Logger} from '@selfcommunity/utils';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedDate, FormattedMessage, FormattedTime, useIntl} from 'react-intl';

const PREFIX = 'SCAccountDataPortability';

const classes = {
  root: `${PREFIX}-root`,
  createButton: `${PREFIX}-create-button`,
  downloadButton: `${PREFIX}-download-button`,
  generationInfo: `${PREFIX}-generation-info`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface AccountDataPortabilityProps extends BoxProps {
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS AccountDataPortability component. Learn about the available props and the CSS API.
 *
 *
 * This component allows users to display the logic behind data portability of user data.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/AccountDataPortability)

 #### Import
 ```jsx
 import {AccountDataPortability} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCAccountDataPortability` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAccountDataPortability-root|Styles applied to the root element.|
 |createButton|.SCAccountDataPortability-create-button|Styles applied to the create data portability button in the rejection section.|
 |downloadButton|.SCAccountDataPortability-download-button|Styles applied to the download data portability button in the rejection section.|
 |generationInfo|.SCAccountDataPortability-generation-info|Styles applied to the section with generation information.|

 * @param inProps
 */
export default function AccountDataPortability(inProps: AccountDataPortabilityProps): JSX.Element {
  // PROPS
  const props: AccountDataPortabilityProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [dataPortability, setDataPortability] = useState<SCDataPortabilityType>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadingDataPortability, setDownloadingDataPortability] = useState<boolean>(false);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // INTL
  const intl = useIntl();

  /**
   * Handle create data portability
   */
  const handleCreateDataPortabilityFile = () => {
    setLoading(true);
    DataPortabilityService.generateDataPortability()
      .then((res) => {
        if (res) {
          setDataPortability(dataPortability);
        }
      })
      .catch((_error) => {
        Logger.error(SCOPE_SC_UI, _error);
      })
      .then(() => setLoading(false));
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
   * Fetch data portability status
   */
  const fetchDataPortabilityStatus = () => {
    DataPortabilityService.dataPortabilityStatus()
      .then((res) => {
        if (res) {
          if (!res.computing && res.generated_at) {
            setLoading(false);
          }
          setDataPortability(res);
        }
      })
      .catch((_error) => {
        Logger.error(SCOPE_SC_UI, _error);
      })
      .then(() => setLoading(false));
  };

  /**
   * Sync data portability status
   */
  useEffect(() => {
    // TODO: ?????
    let interval;
    if (authUserId !== null) {
      fetchDataPortabilityStatus();
      interval = setInterval(() => {
        fetchDataPortabilityStatus();
      }, 5000);
    }
    return () => interval && clearInterval(interval);
  }, [authUserId]);

  /**
   * If there's no authUserId, component is hidden.
   */
  if (!authUserId) {
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Typography variant="h6">
        <FormattedMessage
          id="ui.accountDataPortability.title"
          defaultMessage="ui.accountDataPortability.title"
          values={{username: capitalize(scUserContext.user.username)}}
        />
      </Typography>
      <Typography variant="body2" component="div">
        <FormattedMessage
          id="ui.accountDataPortability.info"
          defaultMessage="ui.accountDataPortability.info"
          values={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            li: (chunks) => <li>{chunks}</li>,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            ul: (chunks) => <ul>{chunks}</ul>
          }}
        />
      </Typography>
      <LoadingButton
        size="small"
        loading={(dataPortability && dataPortability.computing) || loading}
        disabled={
          !dataPortability || (dataPortability && (dataPortability.computing || moment().diff(moment(dataPortability.requested_at), 'hours') < 24))
        }
        loadingPosition="start"
        startIcon={<Icon>folder_open</Icon>}
        variant="outlined"
        className={classes.createButton}
        onClick={handleCreateDataPortabilityFile}>
        {(dataPortability && dataPortability.computing) || loading ? (
          <FormattedMessage id="ui.accountDataPortability.createLoadingButton" defaultMessage="ui.accountDataPortability.createLoadingButton" />
        ) : (
          <FormattedMessage id="ui.accountDataPortability.createButton" defaultMessage="ui.accountDataPortability.createButton" />
        )}
      </LoadingButton>
      {dataPortability && !dataPortability.computing && dataPortability.generated_at && (
        <LoadingButton
          size="small"
          loading={downloadingDataPortability}
          loadingPosition="start"
          startIcon={<Icon>cloud_download_outlined</Icon>}
          variant={'outlined'}
          className={classes.downloadButton}
          onClick={handleDownloadDataPortabilityFile}>
          <FormattedMessage id="ui.accountDataPortability.downloadButton" defaultMessage="ui.accountDataPortability.downloadButton" />
        </LoadingButton>
      )}
      <br />
      {dataPortability && !dataPortability.computing && dataPortability.generated_at && (
        <Typography className={classes.generationInfo} variant="body2">
          <FormattedMessage
            id="ui.accountDataPortability.generatedInfo"
            defaultMessage="ui.accountDataPortability.generatedInfo"
            values={{
              date: <FormattedDate value={dataPortability.requested_at} day="numeric" month="long" year="numeric" />,
              time: <FormattedTime value={dataPortability.requested_at} />
            }}
          />
        </Typography>
      )}
    </Root>
  );
}
