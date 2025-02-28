import {Skeleton, SkeletonOwnProps, Stack, TableCell, TableRow} from '@mui/material';

interface CourseUsersTableRowSkeletonProps {
  header?: boolean;
  animation?: SkeletonOwnProps['animation'];
  editMode?: boolean;
}

export default function CourseUsersTableRowSkeleton(props: CourseUsersTableRowSkeletonProps) {
  const {header = false, animation = 'wave', editMode = false} = props;

  return (
    <TableRow>
      {Array.from(new Array(editMode ? 4 : 5)).map((_, i, array) => {
        if (!editMode && i === array.length - 1) {
          return (
            <TableCell width="14%" key={i}>
              <Skeleton animation={animation} variant="rounded" width="139px" height="29px" />
            </TableCell>
          );
        }

        return (
          <TableCell width={!editMode ? '20%' : '25%'} key={i}>
            {!header && i === 0 && (
              <Stack direction="row" alignItems="center" gap="16px">
                <Skeleton animation={animation} variant="circular" width="30px" height="30px" />
                <Skeleton animation={animation} variant="text" width="118px" height="24px" />
              </Stack>
            )}
            {((!header && i > 0) || header) && <Skeleton animation={animation} variant="text" width="78px" height="24px" />}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
