import React, {Fragment} from 'react';
import Chip from '@mui/material/Chip';
import classNames from 'classnames';
import {styled} from '@mui/material/styles';
import {SCTagType, useSCFetchTag} from '@selfcommunity/core';

const PREFIX = 'SCTagChip';

const classes = {
  label: `${PREFIX}-label`,
  main: `${PREFIX}-main`,
  ellipsis: `${PREFIX}-ellipsis`
};

const Root = styled('span', {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(({theme}) => ({
  [`& .${classes.main}`]: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    '&:first-of-type': {
      marginLeft: 0
    }
  },
  [`& .${classes.ellipsis}`]: {
    maxWidth: 120
  },
  [`& .${classes.label}`]: {
    fontSize: '14px',
    paddingLeft: 12,
    paddingRight: 12,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));

export default function TagChip({
  tag = null,
  onClick = null,
  ellipsis = null,
  ...rest
}: {
  tag?: SCTagType;
  onClick?: (id: number) => void;
  ellipsis?: boolean;
  [p: string]: any;
}): JSX.Element {
  /**
   * Handle click on tagChip
   */
  function handleClick(id: number): void {
    onClick(id);
  }

  if (!tag) {
    return <></>;
  }

  return (
    <Root {...rest}>
      <Chip
        size="small"
        classes={{labelSmall: classes.label, root: classNames(classes.main, {[classes.ellipsis]: ellipsis})}}
        sx={{backgroundColor: `${tag.color}`, color: (theme) => theme.palette.getContrastText(tag.color)}}
        onClick={handleClick ? () => handleClick(tag.id) : null}
        label={tag.name}
      />
    </Root>
  );
}
