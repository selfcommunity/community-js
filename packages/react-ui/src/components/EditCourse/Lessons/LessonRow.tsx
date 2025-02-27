import {DraggableProvided} from '@hello-pangea/dnd';
import {Icon, MenuItem, Stack, TableCell, TableRow, Typography} from '@mui/material';
import classNames from 'classnames';
import {PREFIX} from '../constants';
import {memo, useCallback, useState} from 'react';
import MenuRow from '../MenuRow';
import {FormattedMessage} from 'react-intl';
import FieldName from './FieldName';
import ChangeLessonStatus from './ChangeLessonStatus';
import {SCCourseLessonType, SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import {CourseService, Endpoints} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {useSnackbar} from 'notistack';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {ActionLessonEnum, ActionLessonType} from '../types';
import {useDisabled} from '../hooks';

const classes = {
  cellWidth: `${PREFIX}-cell-width`,
  cellAlignRight: `${PREFIX}-cell-align-right`,
  cellPadding: `${PREFIX}-cell-padding`,
  tableBodyIconWrapper: `${PREFIX}-table-body-icon-wrapper`,
  actionsWrapper: `${PREFIX}-actions-wrapper`
};

type DataUrlLesson = {
  id: number;
  slug: string;
  section_id: number;
  lesson_id: number;
};

function getUrlLesson(course: SCCourseType, section: SCCourseSectionType, lesson: SCCourseLessonType): DataUrlLesson {
  return {
    id: course.id,
    slug: course.slug,
    section_id: section.id,
    lesson_id: lesson.id
  };
}

interface LessonRowProps {
  provider: DraggableProvided;
  course: SCCourseType | null;
  section: SCCourseSectionType;
  lesson: SCCourseLessonType;
  isNewRow: boolean;
  handleManageLesson: (lesson: SCCourseLessonType, type: ActionLessonType) => void;
}

function LessonRow(props: LessonRowProps) {
  // PROPS
  const {provider, course, section, lesson, isNewRow, handleManageLesson} = props;

  // STATES
  const [editMode, setEditMode] = useState(false);

  // CONTEXTS
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HOOKS
  const {isDisabled} = useDisabled();
  const {enqueueSnackbar} = useSnackbar();

  // HANDLERS
  const handleAbleEditMode = useCallback(() => setTimeout(() => setEditMode(true)), [setEditMode]);
  const handleDisableEditMode = useCallback(() => setEditMode(false), [setEditMode]);

  const handleDeleteLesson = useCallback(() => {
    CourseService.deleteCourseLesson(course.id, section.id, lesson.id)
      .then(() => {
        handleManageLesson(lesson, ActionLessonEnum.DELETE);

        enqueueSnackbar(
          <FormattedMessage id="ui.editCourse.tab.lessons.table.snackbar.delete" defaultMessage="ui.editCourse.tab.lessons.table.snackbar.delete" />,
          {
            variant: 'success',
            autoHideDuration: 3000
          }
        );
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, [course, section, lesson, handleManageLesson]);

  return (
    <TableRow {...provider.draggableProps} ref={provider.innerRef}>
      <TableCell width="4%" />
      <TableCell component="th" scope="row" {...provider.dragHandleProps} className={classNames(classes.cellWidth, classes.cellPadding)}>
        <Stack className={classes.tableBodyIconWrapper}>
          <Icon color="disabled">drag</Icon>
        </Stack>
      </TableCell>
      <TableCell>
        <FieldName
          endpoint={{
            url: () =>
              isNewRow
                ? Endpoints.CreateCourseLesson.url({id: course.id, section_id: section.id})
                : Endpoints.PatchCourseLesson.url({id: course.id, section_id: section.id, lesson_id: lesson.id}),
            method: isNewRow ? Endpoints.CreateCourseLesson.method : Endpoints.PatchCourseLesson.method
          }}
          row={lesson}
          isNewRow={isNewRow}
          handleManageRow={handleManageLesson}
          editMode={editMode}
          handleDisableEditMode={handleDisableEditMode}
        />
      </TableCell>
      <TableCell />
      <TableCell className={classes.cellAlignRight}>
        <Stack className={classes.actionsWrapper}>
          <ChangeLessonStatus course={course} section={section} lesson={lesson} disabled={isDisabled} />

          <MenuRow disabled={isDisabled}>
            <MenuItem component={Link} to={scRoutingContext.url(SCRoutes.COURSE_LESSON_EDIT_ROUTE_NAME, getUrlLesson(course, section, lesson))}>
              <Typography variant="body1">
                <FormattedMessage id="ui.editCourse.tab.lessons.table.menu.edit" defaultMessage="ui.editCourse.tab.lessons.table.menu.edit" />
              </Typography>
            </MenuItem>
            <MenuItem component={Link} to={scRoutingContext.url(SCRoutes.COURSE_LESSON_ROUTE_NAME, getUrlLesson(course, section, lesson))}>
              <Typography variant="body1">
                <FormattedMessage id="ui.editCourse.tab.lessons.table.menu.view" defaultMessage="ui.editCourse.tab.lessons.table.menu.view" />
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleAbleEditMode}>
              <Typography variant="body1">
                <FormattedMessage id="ui.editCourse.tab.lessons.table.menu.rename" defaultMessage="ui.editCourse.tab.lessons.table.menu.rename" />
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleDeleteLesson}>
              <Typography variant="body1">
                <FormattedMessage id="ui.editCourse.tab.lessons.table.menu.delete" defaultMessage="ui.editCourse.tab.lessons.table.menu.delete" />
              </Typography>
            </MenuItem>
          </MenuRow>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

export default memo(LessonRow);
