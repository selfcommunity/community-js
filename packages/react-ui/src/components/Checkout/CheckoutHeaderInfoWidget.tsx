import React from 'react';
import {CardContent, Icon, styled, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import Widget from '../Widget';
import {SCContentType} from '@selfcommunity/types';
import {Box, useThemeProps} from '@mui/system';
import classNames from 'classnames';
import Placeholder from '../../assets/checkout/general';

const PREFIX = 'SCCheckoutHeaderInfoWidget';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  content: `${PREFIX}-content`
};

const Root = styled(Widget, {
  slot: 'Root',
  name: PREFIX
})(() => ({}));

interface CheckoutHeaderProps {
  className?: string;
  contentType: SCContentType;
  content: any;
}

export default function CheckoutHeaderInfoWidget(inProps: CheckoutHeaderProps) {
  // PROPS
  const props: CheckoutHeaderProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, contentType, content} = props;

  // STATE
  const isRecurring = content?.paywalls?.[0]?.payment_prices?.[0]?.recurring_interval;

  return (
    <Root className={classNames(classes.root, className)} variant="outlined">
      <Box className={classes.header}>
        <img src={Placeholder} alt="icon decoration" />
        <Icon fontSize="large">{contentType === SCContentType.EVENT ? 'ticket' : contentType === SCContentType.GROUP ? 'groups' : 'courses'}</Icon>
      </Box>
      <CardContent className={classes.content}>
        <Typography variant="h5">
          {isRecurring ? (
            <FormattedMessage
              id={`ui.checkout.contentDesc.title.${contentType}.recurring`}
              defaultMessage={`ui.checkout.contentDesc.title.${contentType}.recurring`}
            />
          ) : (
            <FormattedMessage id={`ui.checkout.contentDesc.title.${contentType}`} defaultMessage={`ui.checkout.contentDesc.title.${contentType}`} />
          )}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <FormattedMessage
            id={`ui.checkout.contentDesc.subTitle.${contentType}`}
            defaultMessage={`ui.checkout.contentDesc.subTitle.${contentType}`}
          />
        </Typography>
      </CardContent>
    </Root>
  );
}
