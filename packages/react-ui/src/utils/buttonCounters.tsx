export const DEFAULT_COUNTERS_LIMIT = 3;

export function numberFormatter(num: number) {
  const surplus = num === DEFAULT_COUNTERS_LIMIT ? 1 : num < DEFAULT_COUNTERS_LIMIT ? num : num - DEFAULT_COUNTERS_LIMIT;

  if (surplus > 999999) {
    return <>+{(Math.abs(surplus) / 1000000).toFixed(1)}M</>;
  } else if (surplus > 999) {
    return <>+{(Math.abs(surplus) / 1000).toFixed(1)}K</>;
  }

  return <>+{surplus}</>;
}
