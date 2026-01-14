import React from 'react';
import {styled, Chip, ChipClasses, Theme, ChipPropsSizeOverrides, ChipPropsVariantOverrides, Tooltip} from '@mui/material';
import classNames from 'classnames';
import {SCTagType} from '@selfcommunity/types';
import {OverridableStringUnion} from '@mui/types';
import {SxProps} from '@mui/system';

const PREFIX = 'SCTagChip';

const classes = {
  ellipsis: `${PREFIX}-ellipsis`
};

const Root = styled(Chip, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(({theme}) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: 25,
  [`&.${classes.ellipsis}`]: {
    maxWidth: 120
  }
}));

export interface TagChipProps {
  className?: string;
  /**
   * Overrides or extends the styles applied to the component.
   */
  classes?: Partial<ChipClasses>;
  /**
   * If `true`, the chip will appear clickable, and will raise when pressed,
   * even if the onClick prop is not defined.
   * If `false`, the chip will not appear clickable, even if onClick prop is defined.
   * This can be used, for example, along with the component prop to indicate an anchor Chip is clickable.
   * @default true
   */
  clickable?: boolean;
  /**
   * If `true`, the chip will appear disposable, and will raise when pressed,
   * even if the onDelete prop is not defined.
   * If `false`, the chip will not appear disposable, even if onDelete prop is defined.
   * This can be used, for example, along with the component prop to indicate an anchor Chip is disposable.
   * @default true
   */
  disposable?: boolean;
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Icon element.
   */
  icon?: React.ReactElement;
  /**
   * The content of the component.
   */
  label?: React.ReactNode;
  /**
   * Callback fired when the delete icon is clicked.
   * If set, the delete icon will be shown.
   */
  onClick?: React.EventHandler<any>;
  /**
   * Callback fired when the delete icon is clicked.
   * If set, the delete icon will be shown.
   */
  onDelete?: React.EventHandler<any>;
  /**
   * The size of the component.
   * @default 'medium'
   */
  size?: OverridableStringUnion<'small' | 'medium', ChipPropsSizeOverrides>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * The variant to use.
   * @default 'filled'
   */
  variant?: OverridableStringUnion<'filled' | 'outlined', ChipPropsVariantOverrides>;
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
