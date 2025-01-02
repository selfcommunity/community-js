import {Accordion, AccordionDetails, AccordionSummary, Avatar, Button, Icon, Stack, Typography, useMediaQuery, useTheme} from '@mui/material';
import {Fragment, memo, SyntheticEvent, useCallback, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import BaseDialog from '../BaseDialog';
import {SCThemeType} from '@selfcommunity/react-core';

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

      <BaseDialog
        DialogContentProps={{dividers: isMobile}}
        open={open}
        onClose={handleToggleOpen}
        title={
          <Typography variant="h2">
            <FormattedMessage id="ui.courseUsersTable.dialog.title" defaultMessage="ui.courseUsersTable.dialog.title" />
          </Typography>
        }>
        <Stack
          sx={{
            gap: '8px',
            marginTop: isMobile ? '22px' : undefined
          }}>
          <Stack
            sx={{
              gap: '9px',
              border: '1px solid #E0E0E0',
              borderRadius: '10px',
              padding: '15px 24px 25px'
            }}>
            <Stack
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
              <Stack
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                <Avatar
                  sx={{
                    width: '30px',
                    height: '30px'
                  }}
                  alt=""
                  src=""
                />
                <Typography variant="body2">ciao</Typography>
              </Stack>

              <Button variant="outlined" size="small" color="inherit" onClick={handleClick}>
                Messaggio
              </Button>
            </Stack>

            <Typography variant="body2">Lezioni completate: 3/5</Typography>

            <Typography variant="body2">Corso completato: 75%</Typography>
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
      </BaseDialog>
    </Fragment>
  );
}

export default memo(ActionButton);
