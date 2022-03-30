import { getUnixTime } from "date-fns";

function buildError(title: string, body: string, error: Error) {
  return {
    createdAt: getUnixTime(new Date()),
    title,
    body,
    error,
  };
}

export default buildError;
