import Menu from '@mui/material/Menu';
import {Icon, IconButton} from '@mui/material';
import {Fragment, HTMLAttributes, MouseEvent, PropsWithChildren, ReactNode, useCallback, useState} from 'react';

interface MenuRowProps extends PropsWithChildren {
  icon?: ReactNode;
  buttonClassName?: HTMLAttributes<HTMLButtonElement>['className'];
}

export default function MenuRow(props: MenuRowProps) {
  // PROPS
  const {icon = <Icon>more_vert</Icon>, buttonClassName, children} = props;

  // STATES
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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
      <IconButton className={buttonClassName} onClick={handleClick}>
        {icon}
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClick={handleClose}>
        {children}
      </Menu>
    </Fragment>
  );
}
