import React from 'react';
import {styled} from '@mui/material/styles';
import {CircularProgress, Switch, SwitchProps} from '@mui/material';
import {useThemeProps} from '@mui/system';
import Icon from '@mui/material/Icon';

const PREFIX = 'SCConsentSolutionSwitch';

const classes = {
  root: `${PREFIX}-root`,
  thumb: `${PREFIX}-thumb`,
  thumbChecked: `${PREFIX}-thumb-checked`,
  thumbUnChecked: `${PREFIX}-thumb-unchecked`,
  thumbLoader: `${PREFIX}-thumb-loader`
};

const Root = styled(Switch, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(({theme}) => ({
  width: 64,
  height: 31,
  padding: 0,
  [`& .${classes.thumb}`]: {
    boxShadow: theme.shadows[1],
    backgroundColor: 'currentColor',
    width: 25,
    height: 25,
    borderRadius: '50%'
  },
  [`& .${classes.thumbChecked}`]: {
    position: 'relative',
    color: theme.palette.primary.main,
    fontSize: '1.2rem',
    top: 5,
    left: 5
  },
  [`& .${classes.thumbUnChecked}`]: {
    position: 'relative',
    color: theme.palette.grey[500],
    fontSize: '1.2rem',
    top: 4,
    left: 5
  },
  [`& .${classes.thumbLoader}`]: {
    position: 'relative',
    left: 5,
    top: 5,
    color: theme.palette.primary.main
  },
  '&:focus': {
    outlineWidth: '2px!important',
    outlineStyle: 'solid!important',
    outlineColor: `${theme.palette.info.main}!important`,
    outlineOffset: '2px!important',
    borderRadius: 32
  },
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 3,
    transitionDuration: '300ms',
    '& + .MuiSwitch-track': {
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300]
    },
    '&.Mui-checked': {
      transform: 'translateX(32px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: theme.palette.primary.main,
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 26,
    height: 26,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }
  },
  '& .MuiSwitch-track': {
    borderRadius: 32 / 2,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}));

export interface ConsentSolutionSwitchProps extends SwitchProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * if component is loading
   */
  loading?: boolean;
}

/**
 * > API documentation for the Community-JS ConsentSolutionSwitch component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ConsentSolutionSwitch} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCConsentSolutionSwitch` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCConsentSolutionSwitch-root|Styles applied to the root element.|
 |thumb|.SCConsentSolutionSwitch-thumb|Styles applied to the thumb element.|
 |thumbChecked|.SCConsentSolutionSwitch-thumb|Styles applied to the checked icon element.|
 |thumbUnChecked|.SCConsentSolutionSwitch-thumb-checked|Styles applied to the unchecked icon element.|
 |thumbLoading|.SCConsentSolutionSwitch-thumb-unchecked|Styles applied to the loading icon element.|

 * @param inProps
 */
export default function ConsentSolutionSwitch(inProps: ConsentSolutionSwitchProps): JSX.Element {
  //PROPS
  const props: ConsentSolutionSwitchProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {loading, ...rest} = props;

  // Icon loading state
  const IconLoading = () => (
    <span className={classes.thumb}>
      <CircularProgress size={14} className={classes.thumbLoader} />
    </span>
  );

  // Icon checked state
  const IconChecked = () => (
    <span className={classes.thumb}>
      <Icon className={classes.thumbChecked}>check_outlined</Icon>
    </span>
  );

  // Icon unchecked state
  const IconUnChecked = () => (
    <span className={classes.thumb}>
      <Icon className={classes.thumbUnChecked}>close</Icon>
    </span>
  );

  return <Root {...rest} checkedIcon={loading ? <IconLoading /> : <IconChecked />} icon={loading ? <IconLoading /> : <IconUnChecked />} />;
}
