import React, {MouseEvent, useCallback, useState} from 'react';
import classNames from 'classnames';
import {Button, Icon, Tooltip, styled} from '@mui/material';
import {useThemeProps} from '@mui/system';
import {SCContextType, SCUserContextType, useSCContext, useSCFetchPaymentOrder, useSCPaymentsEnabled, useSCUser} from '@selfcommunity/react-core';
import {SCPaymentOrder} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import PdfPreviewDialog from '../PdfPreviewDialog';
import {Endpoints} from '@selfcommunity/api-services';

const PREFIX = 'SCPaymentOrderPdfButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'root'
})(() => ({}));

export interface PaymentOrderPdfButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Content id
   */
  paymentOrderId?: number | string;

  /**
   * Payment Order
   */
  paymentOrder?: SCPaymentOrder;

  /**
   * Handle click
   */
  handleClick?: () => void;

  /**
   * Override button label
   */
  label?: React.ReactNode;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS PaymentOrderPdfButton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PaymentOrderPdfButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `PaymentOrderPdfButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPaymentOrderPdfButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function PaymentOrderPdfButton(inProps: PaymentOrderPdfButtonProps): JSX.Element {
  // PROPS
  const props: PaymentOrderPdfButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, paymentOrderId, paymentOrder, handleClick, PdfPreviewDialogComponentProps = {}, label, ...rest} = props;

  // STATE
  const [open, setOpen] = useState<boolean>(false);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const {scPaymentOrder} = useSCFetchPaymentOrder({id: paymentOrderId, paymentOrder});

  // HANDLERS
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [open]);

  const handlePaymentOrderPdf = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (handleClick) {
        handleClick();
      } else if (!open) {
        setOpen(true);
      }
    },
    [open, handleClick]
  );

  if (!scUserContext.user || !isPaymentsEnabled || !scPaymentOrder) {
    return null;
  }

  return (
    <>
      <Tooltip
        title={
          !scPaymentOrder ? (
            <FormattedMessage id="ui.paymentOrderPdfButton.disabled" defaultMessage="ui.paymentOrderPdfButton.disabled" />
          ) : (
            <FormattedMessage id="ui.paymentOrder.ticket.view" defaultMessage="ui.paymentOrder.ticket.view" />
          )
        }>
        <Root className={classNames(classes.root, className)} variant="contained" onClick={handlePaymentOrderPdf} {...rest}>
          {label ? label : <Icon>picture_as_pdf</Icon>}
        </Root>
      </Tooltip>
      {open && (
        <PdfPreviewDialog
          open
          onClose={handleClose}
          {...PdfPreviewDialogComponentProps}
          pdfUrl={`${new URL(scContext.settings.portal)}${Endpoints.GetPaymentOrderPdf.url({id: scPaymentOrder.id})}`}
        />
      )}
    </>
  );
}
