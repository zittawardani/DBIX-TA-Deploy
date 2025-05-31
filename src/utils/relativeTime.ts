import { formatDistanceToNow } from "date-fns";
const relativeTime = {
  fromNow: (date: Date) => {
    const iso = new Date(date)
    return formatDistanceToNow(iso, { addSuffix: true })
  }
}

export default relativeTime