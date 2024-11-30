import { Timestamp } from "firebase/firestore";

export const getDateString = (timestamp: Timestamp | Date) => {
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString([], {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString([], {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
};
