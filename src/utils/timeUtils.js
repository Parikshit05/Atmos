export function formatTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

export function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function getHoursUntilSunset(sunset) {
  const now = new Date();
  const diff = sunset.getTime() - now.getTime();
  return Math.max(0, diff / (1000 * 60 * 60));
}

export function getHoursUntilSunrise(sunrise) {
  const now = new Date();
  const diff = sunrise.getTime() - now.getTime();
  return Math.max(0, diff / (1000 * 60 * 60));
}

export function isNightTime(hour, sunrise, sunset) {
  return hour < sunrise.getHours() || hour >= sunset.getHours();
}

export function getTimeOfDay(hour) {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 19) return 'golden';
  if (hour >= 19 && hour < 20) return 'sunset';
  if (hour >= 20 && hour < 21) return 'blue-hour';
  if (hour >= 21 && hour < 5) return 'night';
  return 'late-night';
}

export function formatHourlyTime(dateStr) {
  const d = new Date(dateStr);
  let hours = d.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours} ${ampm}`;
}

export function formatDay(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatFullDay(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}
