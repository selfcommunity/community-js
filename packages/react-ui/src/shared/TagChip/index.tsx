import React from 'react';
import {styled, Chip, Tooltip, ChipProps} from '@mui/material';
import classNames from 'classnames';
import {SCTagType} from '@selfcommunity/types';

const PREFIX = 'SCTagChip';

const classes = {
  ellipsis: `${PREFIX}-ellipsis`
};

const Root = styled(Chip, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => [styles.root]
})(() => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: 25,
  [`&.${classes.ellipsis}`]: {
    maxWidth: 120
  }
}));

export interface TagChipProps extends Omit<ChipProps, 'avatar' | 'children' | 'color' | 'deleteIcon' | 'skipFocusWhenDisabled' | 'tabIndex'> {
  className?: string;
  /**
   * If `true`, the chip will appear disposable, and will raise when pressed,
   * even if the onDelete prop is not defined.
   * If `false`, the chip will not appear disposable, even if onDelete prop is defined.
   * This can be used, for example, along with the component prop to indicate an anchor Chip is disposable.
   * @default true
   */
  disposable?: boolean;
  /**
   * Callback fired when the delete icon is clicked.
   * If set, the delete icon will be shown.
   */
  onClick?: React.EventHandler<any>;
  /**
   * The tag to use.
   * @default null
   */
  tag: SCTagType;
  /**
   * Use ellipsis to truncate tag
   * @default false
   */
  ellipsis?: boolean;
  /**
   * If `true`, shows the description of the tag on hover (desktop) or long press (mobile).
   * @default false
   */
  showDescription?: boolean;
}

export default function TagChip(props: TagChipProps): JSX.Element {
  // PROPS
  const {
    tag,
    clickable = true,
    disposable = true,
    label = null,
    ellipsis = false,
    onClick = null,
    onDelete = null,
    className = null,
    showDescription = false,
    ...rest
  } = props;

  // HANDLERS
  const handleClick = (): void => {
    onClick && onClick(tag.id);
  };
  const handleDelete = (): void => {
    onDelete && onDelete(tag.id);
  };

  const root = (
    <Root
      className={classNames(className, {[classes.ellipsis]: ellipsis})}
      sx={{backgroundColor: `${tag.color}`, color: (theme) => theme.palette.getContrastText(tag.color)}}
      {...(clickable && {onClick: handleClick})}
      {...(disposable && {onDelete: handleDelete})}
      label={label ? label : tag.name}
      {...rest}
    />
  );

  /**
   * Renders root object
   */
  if (showDescription && tag.description) {
    return (
      <Tooltip title={tag.description} placement="right" arrow>
        {root}
      </Tooltip>
    );
  }

  return root;
}
