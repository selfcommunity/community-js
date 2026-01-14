import {Icon, IconButton, SwipeableDrawer, useMediaQuery, useTheme, Menu} from '@mui/material';
import {Fragment, HTMLAttributes, memo, MouseEvent, PropsWithChildren, ReactNode, useCallback, useState} from 'react';
import {SCThemeType} from '@selfcommunity/react-core';

interface MenuRowProps extends PropsWithChildren {
  icon?: ReactNode;
  buttonClassName?: HTMLAttributes<HTMLButtonElement>['className'];
  disabled?: boolean;
}

function MenuRow(props: MenuRowProps) {
  // PROPS
  const {icon = <Icon>more_vert</Icon>, buttonClassName, disabled, children} = props;

  // STATES
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // HANDLERS
  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(e.currentTarget);
    },
    [anchorEl]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [anchorEl]);

  return (
    <Fragment>
      <IconButton className={buttonClassName} onClick={handleClick} disabled={disabled}>
        {icon}
      </IconButton>

      {isMobile ? (
        <SwipeableDrawer open={Boolean(anchorEl)} onClick={handleClose} onClose={handleClose} onOpen={() => null} anchor="bottom" disableSwipeToOpen>
          {children}
        </SwipeableDrawer>
      ) : (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClick={handleClose}>
          {children}
        </Menu>
      )}
    </Fragment>
  );
}

export default memo(MenuRow);
