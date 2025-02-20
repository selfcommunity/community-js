import {Button, ButtonProps, Icon, IconButton, Typography, useMediaQuery, useTheme} from '@mui/material';
import {SCThemeType} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from '../constants';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import {SCGroupEventType, SCTopicType} from '../../../constants/PubSub';
import {Fragment, memo, useCallback} from 'react';

const classes = {
  sectionButton: `${PREFIX}-section-button`,
  sectionButtonTypography: `${PREFIX}-section-button-typography`
};

interface AddButtonProps extends ButtonProps {
  label: string;
  handleAddRow: () => void;
}

function AddButton(props: AddButtonProps) {
  // PROPS
  const {label, handleAddRow, className, ...rest} = props;

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // HANDLERS
  const handleClick = useCallback(() => {
    handleAddRow();
    PubSub.publish(`${SCTopicType.COURSE}.${SCGroupEventType.UPDATE}`, true);
  }, [handleAddRow]);

  return (
    <Fragment>
      {isMobile ? (
        <IconButton onClick={handleClick}>
          <Icon>add_circle_outline</Icon>
        </IconButton>
      ) : (
        <Button
          className={classNames(classes.sectionButton, className)}
          size="small"
          startIcon={<Icon>add_circle_outline</Icon>}
          onClick={handleClick}
          {...rest}>
          <Typography className={classes.sectionButtonTypography} variant="body1">
            <FormattedMessage id={label} defaultMessage={label} />
          </Typography>
        </Button>
      )}
    </Fragment>
  );
}

export default memo(AddButton);
