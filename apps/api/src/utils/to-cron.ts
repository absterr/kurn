export default function toCron(interval: string, startAt: string) {
  const [hr, min] = startAt.split(":");
  const hour = Number(hr);
  const minute = Number(min);

  switch (interval) {
    case "6h": {
      const hours = [0, 6, 12, 18].map((h) => (hour + h) % 24);
      return `${minute} ${hours.join(",")} * * *`;
    }
    case "12h": {
      const hours = [0, 12].map((h) => (hour + h) % 24);
      return `${minute} ${hours.join(",")} * * *`;
    }
    default:
      return `${minute} ${hour} * * *`;
  }
}
