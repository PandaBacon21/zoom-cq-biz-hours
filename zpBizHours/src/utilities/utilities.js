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
    console.log("Incorrect Day of Week");
    return "Incorrect Day of Week";
  }
  return day;
}

export async function parseTodaysHours(callQueueUsers) {
  let users = callQueueUsers;
  let weekday = await checkWeekDay(users[0].todays_hours.weekday);
  console.log(users[0].todays_hours.from);

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
