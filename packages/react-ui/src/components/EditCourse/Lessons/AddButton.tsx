import {Button, ButtonOwnProps, Icon, IconButton, Typography, useMediaQuery, useTheme} from '@mui/material';
import {SCThemeType} from '@selfcommunity/react-core';
import {Fragment, HTMLAttributes} from 'react';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from '../constants';
import classNames from 'classnames';

const classes = {
  sectionButton: `${PREFIX}-section-button`,
  sectionButtonTypography: `${PREFIX}-section-button-typography`
};

interface AddButtonProps {
  label: string;
  handleAddRow: () => void;
  color?: ButtonOwnProps['color'];
  variant?: ButtonOwnProps['variant'];
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

export default function AddButton(props: AddButtonProps) {
  // PROPS
  const {label, handleAddRow, color, variant, className} = props;

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Fragment>
      {isMobile ? (
        <IconButton onClick={handleAddRow}>
          <Icon>add_circle_outline</Icon>
        </IconButton>
      ) : (
        <Button
          className={classNames(classes.sectionButton, className)}
          color={color}
          variant={variant}
          size="small"
          startIcon={<Icon>add_circle_outline</Icon>}
          onClick={handleAddRow}>
          <Typography className={classes.sectionButtonTypography} variant="body1">
            <FormattedMessage id={label} defaultMessage={label} />
          </Typography>
        </Button>
      )}
    </Fragment>
  );
}
