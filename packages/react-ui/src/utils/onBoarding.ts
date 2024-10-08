export function formatColorLabel(obj) {
  let {name} = obj;
  const colorIndex = name.toLowerCase().indexOf('color');
  if (colorIndex !== -1 && (colorIndex === 0 || name[colorIndex - 1] !== '_')) {
    name = name.substring(colorIndex + 5); // 'color' is 5 characters long
  }
  const parts = name.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  return parts.join(' ');
}

export function formatLogoLabel(obj) {
  return obj
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
