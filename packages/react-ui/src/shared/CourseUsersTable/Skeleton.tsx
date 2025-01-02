import {Box, Skeleton, styled, Table, TableBody, TableContainer, TableHead} from '@mui/material';
import CourseUsersTableRowSkeleton from './RowSkeleton';
import {PREFIX} from './constants';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})(() => ({}));

export default function CourseUsersTableSkeleton() {
  return (
    <Root>
      <Skeleton animation="wave" variant="rectangular" width="100%" height="53px" />

      <TableContainer>
        <Table>
          <TableHead>
            <CourseUsersTableRowSkeleton header={true} editMode />
          </TableHead>

          <TableBody>
            <CourseUsersTableRowSkeleton editMode />
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
