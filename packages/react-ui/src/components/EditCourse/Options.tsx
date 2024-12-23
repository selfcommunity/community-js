import {Divider, Stack, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from './constants';
import {useCallback, useEffect, useState} from 'react';
import {getOptionsData, setOptionsData} from './data';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {OptionsData} from './types';
import {useSnackbar} from 'notistack';
import SwitchForm from './Options/SwitchForm';
import useDeepCompareEffect from 'use-deep-compare-effect';
import OptionsSkeleton from './Options/Skeleton';
import {LoadingButton} from '@mui/lab';

const classes = {
  optionsWrapper: `${PREFIX}-options-wrapper`,
  optionsDivider: `${PREFIX}-options-divider`,
  optionsButtonWrapper: `${PREFIX}-options-button-wrapper`
};

const OPTIONS = {
  options: {
    title: 'ui.editCourse.tab.options',
    description: 'ui.editCourse.options.description'
  },
  notifications: {
    title: 'ui.editCourse.options.notifications',
    description: 'ui.editCourse.options.notifications.description'
  },
  permissions: {
    title: 'ui.editCourse.options.permissions',
    description: 'ui.editCourse.options.permissions.description'
  }
};

export default function Options() {
  // STATES
  const [options, setOptions] = useState<OptionsData | null>(null);
  const [tempOptions, setTempOptions] = useState<OptionsData | null>(null);
  const [canSave, setCanSave] = useState(false);
  const [loading, setLoading] = useState(false);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // EFFECTS
  useEffect(() => {
    getOptionsData()
      .then((data) => {
        if (data) {
          setOptions(data);
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, []);

  useDeepCompareEffect(() => {
    if (!options || !tempOptions) {
      return;
    }

    if (
      options.options !== tempOptions.options ||
      options.notifications !== tempOptions.notifications ||
      options.permissions !== tempOptions.permissions
    ) {
      setCanSave(true);
    } else {
      setCanSave(false);
    }
  }, [options, tempOptions, setCanSave]);

  // HANDLERS
  const handleChange = useCallback(
    (key: string, value: boolean) => {
      setTempOptions((prevOptions) => {
        if (!prevOptions) {
          return {
            ...options,
            [key]: value
          };
        }

        return {
          ...prevOptions,
          [key]: value
        };
      });
    },
    [setTempOptions, options]
  );

  const handleSubmit = useCallback(() => {
    setLoading(true);

    setOptionsData(tempOptions)
      .then((data) => {
        if (data) {
          setOptions(data);
          setTempOptions(null);
          setCanSave(false);
          setLoading(false);

          enqueueSnackbar(
            <FormattedMessage id="ui.contributionActionMenu.actionSuccess" defaultMessage="ui.contributionActionMenu.actionSuccess" />,
            {
              variant: 'success',
              autoHideDuration: 3000
            }
          );
        } else {
          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, [options, tempOptions, setCanSave, setLoading]);

  if (!options) {
    return <OptionsSkeleton />;
  }

  return (
    <>
      <Stack className={classes.optionsWrapper}>
        {Object.entries(OPTIONS).map(([key, value], i) => (
          <SwitchForm
            key={i}
            name={key}
            title={value.title}
            description={value.description}
            checked={options[key]}
            handleChangeOptions={handleChange}
          />
        ))}
      </Stack>

      <Divider className={classes.optionsDivider} />

      <Stack className={classes.optionsButtonWrapper}>
        <LoadingButton size="small" variant="contained" disabled={!canSave} onClick={handleSubmit} loading={loading}>
          <Typography variant="body1">
            <FormattedMessage id="ui.editCourse.options.button.save" defaultMessage="ui.editCourse.options.button.save" />
          </Typography>
        </LoadingButton>
      </Stack>
    </>
  );
}
