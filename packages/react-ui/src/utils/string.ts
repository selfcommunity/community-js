export const formatCroppedName = (name, maxLength) => {
  if (name.length <= maxLength) {
    return name;
  }
  return name.substring(0, maxLength) + '...';
};

export const formatEventLocationGeolocation = (geolocation: string | null, isTitle?: boolean) => {
  if (!geolocation) {
    return null;
  }

  const parts = geolocation.split(',');

  if (isTitle) {
    return parts[0].trim();
  }

  return parts.slice(1).join(',').trim();
};
