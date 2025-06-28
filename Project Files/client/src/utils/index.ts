import { parsePhoneNumber } from "libphonenumber-js";
import moment from "moment";
import dayjs from "dayjs";

// prevent auto form submission
export function onKeyDown(keyEvent: any) {
  if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
    keyEvent.preventDefault();
  }
}

// remove dash and space from the number
export const removeDashAndSpace = (value: string) => {
  return value.replace(/[- ]/g, "");
};

// Format Date Time 2023-11-19T08:58:06.435Z => 11/19/2023, 1:58:06 PM
export function formatDateTime(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const date = new Date(dateString);
  const formattedDateTime = date.toLocaleString("en-US", options);

  return formattedDateTime;
}

// 2023-11-21T19:00:00.000Z => 11/22/2023
export function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const date = new Date(dateString);
  const formattedDateTime = date.toLocaleString("en-US", options);

  return formattedDateTime;
}

// "2023-11-21T11:00:00.644Z" ===> 4:00:00 PM
export function formatTime(inputDateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const date = new Date(inputDateString);
  const formattedDateTime = date.toLocaleString("en-US", options);

  return formattedDateTime;
}

// Masking Mobile Number +923234910944 => 0323 4910955
export const maskingPhoneNumber = (value: any) => {
  try {
    if (!value) return "";
    const phoneNumber = parsePhoneNumber(value);
    return phoneNumber.formatNational();
  } catch {
    return value;
  }
};

export const add30Minutes = (timeString: string) => {
  return moment(timeString).add(30, "minutes").format("hh:mm A");
};

// Notification Friendly Messages
export function processNotification(notification: string) {
  switch (notification) {
    case "new-doctor-request":
      return "New Doctor 🩺 Request";
    case "new-doctor-request-changed":
      return "🎉 Your requested successfully accepted";
    case "new-appointment-request":
      return "New 💉 Appointment Request";
    case "appointment-status-changed":
      return "Appointment Confirmation";
    default:
      return "Unknown Notification";
  }
}

// Salman Muazam => SM
export function getNameInitials(name: string) {
  const words = name?.split(" ");
  const initials = words?.map((word) => word.charAt(0).toUpperCase());
  return initials?.join("");
}

export function convertToAMPMFormat(time: string | Date) {
  if (!time) return "--";
  return dayjs(time).format("hh:mm A");
}

// 1200 => 1,200
export function thousandSeparatorNumber(number: number) {
  if (typeof number !== "number" || isNaN(number)) {
    return "";
  }

  const numberString = number.toString();
  const [integerPart, decimalPart] = numberString.split(".");
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
}
