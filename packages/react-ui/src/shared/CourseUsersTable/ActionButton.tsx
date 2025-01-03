import {Accordion, AccordionDetails, AccordionSummary, Avatar, Button, Icon, Stack, styled, Typography, useMediaQuery, useTheme} from '@mui/material';
import {Fragment, memo, SyntheticEvent, useCallback, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import BaseDialog from '../BaseDialog';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const classes = {
  dialogRoot: `${PREFIX}-dialog-root`,
  dialogContentWrapper: `${PREFIX}-dialog-content-wrapper`,
  dialogInfoOuterWrapper: `${PREFIX}-dialog-info-outer-wrapper`,
  dialogInfoInnerWrapper: `${PREFIX}-dialog-info-inner-wrapper`,
  dialogAvatarWrapper: `${PREFIX}-dialog-avatar-wrapper`,
  dialogAvatar: `${PREFIX}-dialog-avatar`
};

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot',
  overridesResolver: (_props, styles) => styles.dialogRoot
})(() => ({}));

interface ActionButtonProps {
  course: any;
}

function ActionButton(props: ActionButtonProps) {
  // PROPS
  const {course} = props;

  // STATES
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | false>(false);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // HANDLERS
  const handleToggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const handleClick = useCallback(() => {
    // TODO
  }, []);

  const handleChange = useCallback(
    (panel: string) => (_: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    },
    [setExpanded]
  );

  return (
    <Fragment>
      <Button variant="outlined" size="small" color="inherit" onClick={handleToggleOpen}>
        <Typography variant="body2">
          <FormattedMessage id="ui.courseUsersTable.action.btn.label" defaultMessage="ui.courseUsersTable.action.btn.label" />
        </Typography>
      </Button>

      <DialogRoot
        DialogContentProps={{dividers: isMobile}}
        open={open}
        onClose={handleToggleOpen}
        title={
          <Typography variant="h3">
            <FormattedMessage id="ui.courseUsersTable.dialog.title" defaultMessage="ui.courseUsersTable.dialog.title" />
          </Typography>
        }
        className={classes.dialogRoot}>
        <Stack className={classes.dialogContentWrapper}>
          <Stack className={classes.dialogInfoOuterWrapper}>
            <Stack className={classes.dialogInfoInnerWrapper}>
              <Stack className={classes.dialogAvatarWrapper}>
                <Avatar className={classes.dialogAvatar} alt="" src="" />
                <Typography variant="body1">ciao</Typography>
              </Stack>

              <Button variant="outlined" size="small" color="inherit" onClick={handleClick}>
                <Typography variant="body2">
                  <FormattedMessage id="ui.courseUsersTable.dialog.btn.label" defaultMessage="ui.courseUsersTable.dialog.btn.label" />
                </Typography>
              </Button>
            </Stack>

            <Typography variant="body1">
              <FormattedMessage
                id="ui.courseUsersTable.dialog.info.text1"
                defaultMessage="ui.courseUsersTable.dialog.info.text1"
                values={{lessonsCompleted: '3/5'}}
              />
            </Typography>

            <Typography variant="body1">
              <FormattedMessage
                id="ui.courseUsersTable.dialog.info.text2"
                defaultMessage="ui.courseUsersTable.dialog.info.text2"
                values={{courseCompleted: '75%'}}
              />
            </Typography>
          </Stack>

          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} disableGutters elevation={0} square>
            <AccordionSummary expandIcon={<Icon>expand_less</Icon>}>
              <Typography component="span">Collapsible Group Item #1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} disableGutters elevation={0} square>
            <AccordionSummary expandIcon={<Icon>expand_less</Icon>}>
              <Typography component="span">Collapsible Group Item #2</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Stack>
        {course}
      </DialogRoot>
    </Fragment>
  );
}

export default memo(ActionButton);
