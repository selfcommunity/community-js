import React from 'react';
import Chip from '@mui/material/Chip';
import classNames from 'classnames';
import {styled} from '@mui/material/styles';
import {SCTagType} from '@selfcommunity/react-core';
import {ChipClasses} from '@mui/material/Chip/chipClasses';
import {OverridableStringUnion} from '@mui/types';
import {SxProps} from '@mui/system';
import {InternalStandardProps as StandardProps, Theme} from '@mui/material';
import {ChipPropsSizeOverrides, ChipPropsVariantOverrides} from '@mui/material/Chip/Chip';

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
   * This can be used, for example,
   * along with the component prop to indicate an anchor Chip is clickable.
   * Note: this controls the UI and does not affect the onClick event.
   */
  clickable?: boolean;
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
}

export default function TagChip(props: TagChipProps): JSX.Element {
  // PROPS
  const {tag, label = null, ellipsis = false, onClick = null, onDelete = null, className = null, ...rest} = props;

  // HANDLERS
  const handleClick = (): void => {
    onClick && onClick(tag.id);
  };
  const handleDelete = (): void => {
    onDelete && onDelete(tag.id);
  };

  /**
   * Renders root object
   */
  return (
    <Root
      className={classNames(className, {[classes.ellipsis]: ellipsis})}
      sx={{backgroundColor: `${tag.color}`, color: (theme) => theme.palette.getContrastText(tag.color)}}
      onClick={handleClick}
      onDelete={handleDelete}
      label={label ? label : tag.name}
      {...rest}
    />
  );
}
