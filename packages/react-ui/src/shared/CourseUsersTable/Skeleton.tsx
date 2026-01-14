import {Box, Skeleton, styled, Table, TableBody, TableContainer, TableHead} from '@mui/material';
import CourseUsersTableRowSkeleton from './RowSkeleton';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})(() => ({}));

export default function CourseUsersTableSkeleton() {
  return (
    <Root className={classes.root}>
      <Skeleton animation="wave" variant="rectangular" width="100%" height="53px" />

      <TableContainer>
        <Table>
          <TableHead>
            <CourseUsersTableRowSkeleton header={true} editMode={true} />
          </TableHead>

          <TableBody>
            <CourseUsersTableRowSkeleton editMode={true} />
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
