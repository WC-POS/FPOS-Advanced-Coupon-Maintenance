function formatTime(hour: number, minute: number) {
  if (hour < 12) {
    return `${hour}:${minute.toString().padStart(2, "0")} AM`;
  }
  return `${hour - 12}:${minute.toString().padStart(2, "0")} PM`;
}

export default formatTime;
