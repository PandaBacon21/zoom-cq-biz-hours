// Used in showing/updating business hours modal
export function getDay(value, row) {
  let day = "";
  if (row.weekday === 0) {
    day = "Sunday";
  } else if (row.weekday === 1) {
    day = "Monday";
  } else if (row.weekday === 2) {
    day = "Tuesday";
  } else if (row.weekday === 3) {
    day = "Wednesday";
  } else if (row.weekday === 4) {
    day = "Thursday";
  } else if (row.weekday === 5) {
    day = "Friday";
  } else if (row.weekday === 6) {
    day = "Saturday";
  } else {
    console.log("Not a valid day");
    return "Not a valid day";
  }
  return day;
}
// Used in showing/updating business hours modal
export function getWorkday(value, row) {
  let workday = "Yes";
  if (row.type === 0) {
    workday = "No";
    return workday;
  }
  return workday;
}

// Used to update the callQueueUsers state after updating business hours
export async function updateCallQueueUserBusinessHours(callQueueUsers, hours) {
  let updatedCallQueueUsers = callQueueUsers;

  for (let i = 0; i < updatedCallQueueUsers.length; i++) {
    if (updatedCallQueueUsers[i].extension_id === hours.extension_id) {
      updatedCallQueueUsers[i].all_business_hours = hours.business_hours;
    }
  }
  return updatedCallQueueUsers;
}
