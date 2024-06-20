export const formatCroppedName = (name, maxLength) => {
  if (name.length <= maxLength) {
    return name;
  }
  return name.substring(0, maxLength) + '...';
};
