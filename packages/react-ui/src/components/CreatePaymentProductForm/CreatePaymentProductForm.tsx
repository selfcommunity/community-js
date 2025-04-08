import React, {useCallback, useMemo, useState} from 'react';
import {Box, BoxProps, Button, InputAdornment, Stack, TextField, Typography} from '@mui/material';
import {NumericFormat, NumericFormatProps} from 'react-number-format';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {useSCPaymentsEnabled} from '@selfcommunity/react-core';
import {SCPaymentProduct} from '@selfcommunity/types';
import {PREFIX} from './constants';
import {LoadingButton} from '@mui/lab';
import {PaymentApiClient} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage, useIntl} from 'react-intl';
import {DEFAULT_MIN_PRICE} from '../../constants/Payments';

const classes = {
  root: `${PREFIX}-root`,
  error: `${PREFIX}-root`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  padding: theme.spacing(),
  '& .MuiFormControl-root': {
    marginBottom: theme.spacing(2)
  },
  '& .MuiButton-root': {
    maxWidth: 50
  },
  [`& .${classes.error}`]: {
    color: theme.palette.error.main
  }
}));

export interface CreatePaymentProductFormProps extends BoxProps {
  className?: string;
  onCreate?: (p: SCPaymentProduct) => void;
  onCancel?: () => void;
  onError?: (e) => void;
  onChange?: (p) => void;
}

interface CustomProps {
  onChange: (event: {target: {name: string; value: string}}) => void;
  name: string;
}
const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(function NumericFormatCustom(props, ref) {
  const {onChange, ...other} = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
      valueIsNumericString
    />
  );
});

/**
 * Initial Errors
 */
const _initialFieldsError = {name: null, description: null, unitAmount: null};

export default function CreatePaymentProductForm(inProps: CreatePaymentProductFormProps) {
  // PROPS
  const props: CreatePaymentProductFormProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, onCreate, onCancel, onError, onChange, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [unitAmount, setUnitAmount] = useState<number>(0.5);
  const [fieldsError, setFieldsError] = useState<Record<string, string>>(_initialFieldsError);
  const [error, setError] = useState<string | null>(null);

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const intl = useIntl();

  /**
   * Handle change text
   * @param e
   */
  const handleChange = useCallback(
    (field: string, e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      switch (field) {
        case 'name':
          setName(e.target.value);
          break;
        case 'description':
          setDescription(e.target.value);
          break;
        case 'unitAmount':
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setUnitAmount(e.target.value);
          break;
      }
      onChange?.({name, description, unitAmount});
    },
    [setName, setDescription, setUnitAmount, onChange]
  );

  const isValid = useMemo(
    () => () => {
      setFieldsError(_initialFieldsError);
      let _invalid = true;
      if (!name) {
        setFieldsError({
          ...fieldsError,
          name: intl.formatMessage({
            id: 'ui.createPaymentProductForm.error.name.required',
            defaultMessage: 'ui.createPaymentProductForm.error.name.required'
          })
        });
        _invalid = _invalid && false;
      }
      if (!unitAmount || unitAmount < 0.5) {
        setFieldsError({
          ...fieldsError,
          unitAmount: intl.formatMessage(
            {id: 'ui.createPaymentProductForm.error.price.required', defaultMessage: 'ui.createPaymentProductForm.error.price.required'},
            {min: DEFAULT_MIN_PRICE}
          )
        });
        _invalid = _invalid && false;
      }
      return _invalid;
    },
    [setFieldsError, name, unitAmount]
  );

  /**
   * Handle create product
   */
  const handleCreateProduct = useCallback(() => {
    setLoading(true);
    setError(null);
    if (isValid()) {
      PaymentApiClient.createPaymentProduct({
        name,
        unit_amount: unitAmount * 100,
        ...(description ? {description} : {})
      })
        .then((p) => {
          setLoading(false);
          onCreate && onCreate(p);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
          setLoading(false);
          const _e = intl.formatMessage({
            id: 'ui.createPaymentProductForm.title',
            defaultMessage: 'ui.createPaymentProductForm.title'
          });
          onError?.(_e);
          setError(_e);
        });
    } else {
      setLoading(false);
    }
  }, [loading, name, description, unitAmount, error]);

  if (!isPaymentsEnabled) {
    return null;
  }

  console.log(fieldsError);
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Typography mb={1}>
        <FormattedMessage id="ui.createPaymentProductForm.title" defaultMessage="ui.createPaymentProductForm.title" />
      </Typography>
      <TextField
        size="small"
        id="name"
        label={<FormattedMessage id="ui.createPaymentProductForm.name" defaultMessage="ui.createPaymentProductForm.name" />}
        variant="outlined"
        fullWidth
        value={name}
        error={Boolean(fieldsError && fieldsError.name)}
        {...(Boolean(fieldsError && fieldsError.name) && {helperText: fieldsError.name})}
        onChange={(e) => handleChange('name', e)}
      />
      <TextField
        size="small"
        id="description"
        label={<FormattedMessage id="ui.createPaymentProductForm.description" defaultMessage="ui.createPaymentProductForm.description" />}
        variant="outlined"
        fullWidth
        value={description}
        onChange={(e) => handleChange('description', e)}
        multiline
        maxRows={2}
        error={Boolean(fieldsError && fieldsError.description)}
        {...(Boolean(fieldsError && fieldsError.description) && {helperText: fieldsError.description})}
      />
      <TextField
        label={<FormattedMessage id="ui.createPaymentProductForm.price" defaultMessage="ui.createPaymentProductForm.price" />}
        variant="outlined"
        value={unitAmount}
        onChange={(e) => handleChange('unitAmount', e)}
        name="unitAmount"
        id="unitAmount"
        helperText={
          fieldsError && fieldsError.unitAmount ? (
            <>{fieldsError.unitAmount}</>
          ) : (
            <>
              {intl.formatMessage(
                {id: 'ui.createPaymentProductForm.minPrice', defaultMessage: 'ui.createPaymentProductForm.minPrice'},
                {min: DEFAULT_MIN_PRICE}
              )}
            </>
          )
        }
        InputProps={{
          startAdornment: <InputAdornment position="start">€</InputAdornment>,
          inputComponent: NumericFormatCustom as any
        }}
        fullWidth
        error={Boolean(fieldsError && fieldsError.unitAmount)}
      />
      {error && (
        <Typography component="div" className={classes.error} variant="body2">
          {error}
        </Typography>
      )}
      <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={1}>
        {onCancel && (
          <Button variant="text" size="small" color="inherit" onClick={onCancel}>
            <FormattedMessage id="ui.createPaymentProductForm.btn.cancel" defaultMessage="ui.createPaymentProductForm.btn.cancel" />
          </Button>
        )}
        <LoadingButton loading={loading} variant="contained" size="small" color="error" onClick={handleCreateProduct}>
          <FormattedMessage id="ui.createPaymentProductForm.btn.create" defaultMessage="ui.createPaymentProductForm.btn.create" />
        </LoadingButton>
      </Stack>
    </Root>
  );
}
