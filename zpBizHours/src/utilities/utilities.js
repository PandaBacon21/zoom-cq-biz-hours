// Used to update weekday values to the name of the day
export async function checkWeekDay(weekday) {
  let day = "";
  if (weekday === new Date().getDay() && weekday === 0) {
    day = "Sunday";
  } else if (weekday === new Date().getDay() && weekday === 1) {
    day = "Monday";
  } else if (weekday === new Date().getDay() && weekday === 2) {
    day = "Tuesday";
  } else if (weekday === new Date().getDay() && weekday === 3) {
    day = "Wednesday";
  } else if (weekday === new Date().getDay() && weekday === 4) {
    day = "Thursday";
  } else if (weekday === new Date().getDay() && weekday === 5) {
    day = "Friday";
  } else if (weekday === new Date().getDay() && weekday === 6) {
    day = "Saturday";
  } else {
    console.log("Not a valid day");
    return "Not a valid day";
  }
  return day;
}
// Used to display the day's business hours
export async function parseTodaysHours(callQueueUsers) {
  let users = callQueueUsers;
  let weekday = await checkWeekDay(users[0].todays_hours.weekday);

  for (let i = 0; i < users.length; i++) {
    if (users[i].todays_hours.from)
      if (users[i].todays_hours.type === 0) {
        users[i].todays_hours = `${weekday}: Not Working Today`;
      } else {
        users[
          i
        ].todays_hours = `${weekday}: ${users[i].todays_hours.from} - ${users[i].todays_hours.to}`;
      }
  }
  return users;
}

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
