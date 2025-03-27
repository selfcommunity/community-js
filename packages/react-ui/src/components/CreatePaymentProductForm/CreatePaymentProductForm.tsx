import React, {useCallback, useState} from 'react';
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
      // prefix="€"
    />
  );
});

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
  const [error, setError] = useState<string | null>(null);

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const intl = useIntl();

  /**
   * Handle change text
   * @param e
   */
  const handleChange = useCallback((field: string, e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
  }, []);

  /**
   * Handle create product
   */
  const handleCreateProduct = useCallback(() => {
    setLoading(true);
    setError(null);
    PaymentApiClient.createPaymentProduct({name, description, unit_amount: unitAmount})
      .then((p) => {
        setLoading(false);
        onCreate && onCreate(p);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        setLoading(false);
        onError && onError(intl.formatMessage({id: 'ui.createPaymentProductForm.title', defaultMessage: 'ui.createPaymentProductForm.title'}));
      });
  }, [loading, name, description, unitAmount, error]);

  if (!isPaymentsEnabled) {
    return null;
  }

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
      />
      <TextField
        label={<FormattedMessage id="ui.createPaymentProductForm.price" defaultMessage="ui.createPaymentProductForm.price" />}
        variant="outlined"
        value={unitAmount}
        onChange={(e) => handleChange('unitAmount', e)}
        name="unitAmount"
        id="unitAmount"
        InputProps={{
          startAdornment: <InputAdornment position="start">€</InputAdornment>,
          inputComponent: NumericFormatCustom as any
        }}
        fullWidth
      />
      {error && (
        <Typography component="div" className={classes.error} variant="body2">
          {error}
        </Typography>
      )}
      <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={1}>
        {onCancel && (
          <Button variant="text" size="small" color="error" onClick={onCancel}>
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
