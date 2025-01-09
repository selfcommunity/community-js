import {Accordion, AccordionDetails, AccordionSummary, Box, Icon, styled, Typography, useThemeProps} from '@mui/material';
import {SectionRowInterface} from '../../components/EditCourse/types';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {HTMLAttributes, SyntheticEvent, useCallback, useState} from 'react';
import {SCCourseType} from '@selfcommunity/types';

const PREFIX = 'SCAccordionLessons';

const classes = {
  root: `${PREFIX}-root`,
  accordion: `${PREFIX}-accordion`,
  summary: `${PREFIX}-summary`,
  details: `${PREFIX}-details`,
  circle: `${PREFIX}-circle`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface AccordionLessonsProps {
  course: SCCourseType | null;
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

export default function AccordionLessons(inProps: AccordionLessonsProps) {
  // PROPS
  const props: AccordionLessonsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {course, className} = props;

  //STATES
  const [expanded, setExpanded] = useState<number | false>(false);

  // HANDLERS
  const handleChange = useCallback(
    (panel: number) => (_: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    },
    [setExpanded]
  );

  if (!course) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)}>
      {course['sections'].map((section: SectionRowInterface) => (
        <Accordion
          key={section.id}
          className={classes.accordion}
          expanded={expanded === section.id}
          onChange={handleChange(section.id)}
          disableGutters
          elevation={0}
          square>
          <AccordionSummary className={classes.summary} expandIcon={<Icon>expand_less</Icon>}>
            <Typography component="span" variant="body1">
              {section.name}
            </Typography>
            <Typography component="span" variant="body1">
              <FormattedMessage
                id="ui.course.table.lessons.title"
                defaultMessage="ui.course.table.lessons.title"
                values={{
                  lessonsNumber: section.lessons.length
                }}
              />
            </Typography>
          </AccordionSummary>
          {section.lessons.map((lesson) => (
            <AccordionDetails key={lesson.id} className={classes.details}>
              {lesson.completed ? (
                <Icon fontSize="small" color="primary">
                  circle_checked
                </Icon>
              ) : (
                <Box className={classes.circle} />
              )}
              <Typography>{lesson.name}</Typography>
            </AccordionDetails>
          ))}
        </Accordion>
      ))}
    </Root>
  );
}
