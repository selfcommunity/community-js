import {Box, Button, Icon, Popover, Stack, styled, Typography} from '@mui/material';
import {SCCourseType} from '@selfcommunity/types';
import classNames from 'classnames';
import {HTMLAttributes, memo, MouseEvent, useCallback, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

const PREFIX = 'SCCourseTypePopover';

const classes = {
  root: `${PREFIX}-root`,
  button: `${PREFIX}-button`
};

const Root = styled(Stack, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface CourseTypePopoverProps {
  course: SCCourseType;
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

function CourseTypePopover(props: CourseTypePopoverProps) {
  // PROPS
  const {course, className} = props;

  // STATES
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  // INTL
  const intl = useIntl();

  // HANDLERS
  const handleOpenPopover = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      setAnchorEl(e.currentTarget);
    },
    [setAnchorEl]
  );

  const handlePopoverClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  return (
    <Root className={classNames(classes.root, className)}>
      <Icon fontSize="small">courses</Icon>

      <Button variant="text" color="inherit" size="small" className={classes.button} onClick={handleOpenPopover}>
        <Typography variant="body2">
          <FormattedMessage
            id="ui.course.type"
            defaultMessage="ui.course.type"
            values={{
              typeOfCourse: intl.formatMessage({
                id: `ui.course.type.${course.type}`,
                defaultMessage: `ui.course.type.${course.type}`
              })
            }}
          />
        </Typography>
      </Button>
      {open && (
        <Popover
          open
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          onClose={handlePopoverClose}>
          <Box sx={{padding: '10px'}}>
            <Typography component="span" variant="body2" sx={{whiteSpace: 'pre-line'}}>
              <FormattedMessage id={`ui.courseForm.${course.type}.info`} defaultMessage={`ui.courseForm.${course.type}.info`} />
            </Typography>
          </Box>
        </Popover>
      )}
    </Root>
  );
}

export default memo(CourseTypePopover);
