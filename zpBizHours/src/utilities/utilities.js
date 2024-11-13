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

// Format and display todays hours
export function getTodaysHours(value) {
  let currentDay = new Date().getDay();
  let from;
  let to;
  for (let i = 0; i < value.length; i++) {
    if (value[i].weekday === currentDay) {
      from = value[i].from;
      to = value[i].to;
    }
  }
  let newFrom = formatTime(from);
  let newTo = formatTime(to);
  return `${newFrom} ~ ${newTo}`;
}

// Formats the time to display properly
function formatTime(time) {
  let splitTime = time.split(":");
  if (splitTime[0] > "12") {
    splitTime[0] = (splitTime[0] - "12").toString();
    splitTime[2] = "PM";
    if (splitTime[0] < 10) {
      splitTime[0] = "0" + splitTime[0];
    }
  } else {
    splitTime[2] = "AM";
  }
  return `${splitTime[0]}:${splitTime[1]} ${splitTime[2]}`;
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

export function convertTime(newValue) {
  let newTime = "";
  if (newValue.$H < 10) {
    newTime = `0${newValue.$H}:`;
  } else {
    newTime = `${newValue.$H}:`;
  }
  if (newValue.$m < 10) {
    newTime = newTime + `0${newValue.$m}:00`;
  } else {
    newTime = newTime + `${newValue.$m}:00`;
  }
  return newTime;
}

// export async function applyHoursToAll(params, currentHours, setNewHours) {
//   console.log(currentHours);
//   console.log(params);
//   let updatedHours = currentHours;
//   let targetTo = params.row.to;
//   let targetFrom = params.row.from;
//   for (let i = 0; i < updatedHours.length; i++) {
//     updatedHours[i].from = targetFrom;
//     updatedHours[i].to = targetTo;
//   }
//   setNewHours(updatedHours);
//   console.log(updatedHours);
// }
