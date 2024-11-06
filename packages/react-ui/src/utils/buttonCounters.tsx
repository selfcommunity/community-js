export function numberFormatter(num: number) {
  const surplus = num - 3;

  if (surplus > 999999) {
    return <>+{(Math.abs(surplus) / 1000000).toFixed(1)}M</>;
  } else if (num > 999) {
    return <>+{(Math.abs(surplus) / 1000).toFixed(1)}K</>;
  }

  return <>+{surplus}</>;
}
