import axios from "axios";
import { Buffer } from "buffer";

const zoomAuth = "https://zoom.us/oauth/";
const zoomAPI = "https://api.zoom.us/v2/";

const currentToken = { access_token: "", expires: 0 };

// Headers for Zoom API
function createHeader(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

// Check if the token is more than 45 min old (Zoom toke will expire after 1 hour) - Not working all the time...
function checkAccessTokenExpire(currentToken) {
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - currentToken.expires;

  // Return True if 45 min have passed since the last token was retrieved
  const expired = timeDifference >= 2700000;

  console.log(`Token Expired? : ${expired}`);
  return expired;
}

// Check our current token or get a new one
export async function getAccessToken() {
  console.log("Checking for Access Token");
  if (
    currentToken.access_token === "" ||
    checkAccessTokenExpire(currentToken)
  ) {
    try {
      console.log("Retrieving new Access Token");
      let oauthToken = Buffer.from(
        `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
      ).toString("base64");

      let res = await axios({
        method: "post",
        url: `${zoomAuth}token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
        headers: { Authorization: `Basic ${oauthToken}` },
      });
      currentToken.access_token = res.data.access_token;
      currentToken.expires = Date.now() + 3600000;
      return res.data.access_token;
    } catch (e) {
      console.log(e);
      return { Error: "An Error Occured Retrieving Access Token" };
    }
  } else {
    console.log("Current Token is still valid");
    return currentToken.access_token;
  }
}

// Get call queues for Queue Picker
export async function getCallQueues(access_token) {
  console.log("Retrieving Call Queues");
  const callQueues = [];
  const res = await axios({
    method: "get",
    url: `${zoomAPI}/phone/call_queues`,
    headers: createHeader(access_token),
  });
  for (let i = 0; i < res.data.call_queues.length; i++) {
    callQueues.push({
      name: res.data.call_queues[i].name,
      id: res.data.call_queues[i].id,
    });
  }
  return callQueues;
}

// Get users for specific call queue to display on queue list
export async function getCallQueueUsers(access_token, call_queue_id) {
  console.log(`Retrieving Users for Call Queue ${call_queue_id}`);
  const callQueueUsers = [];
  const res = await axios({
    method: "get",
    url: `${zoomAPI}/phone/call_queues/${call_queue_id}/members`,
    headers: createHeader(access_token),
  });
  for (let i = 0; i < res.data.call_queue_members.length; i++) {
    const allBusinessHours = await getBusinessHours(
      access_token,
      res.data.call_queue_members[i].extension_id
    );

    callQueueUsers.push({
      id: i + 1,
      user_id: res.data.call_queue_members[i].id,
      name: res.data.call_queue_members[i].name,
      receive_call: res.data.call_queue_members[i].receive_call ? "On" : "Off",
      extension_id: res.data.call_queue_members[i].extension_id,
      all_business_hours: allBusinessHours.business_hours,
    });
  }
  return callQueueUsers;
}

// Update call queue to add new member from update cq user
export async function updateCallQueueUsers(access_token, call_queue_id, user) {
  const res = await axios({
    method: "post",
    url: `${zoomAPI}/phone/call_queues/${call_queue_id}/members`,
    headers: createHeader(access_token),
    data: {
      members: {
        users: [
          {
            email: user.email,
            id: user.id,
          },
        ],
      },
    },
  });
  console.log("Update Call Queue Members Status: " + res.status);
  const updatedCallQueueUsers = await getCallQueueUsers(
    access_token,
    call_queue_id
  );
  return updatedCallQueueUsers;
}

// remove user from specific call queue from remove cq user
export async function removeCallQueueUsers(access_token, call_queue_id, users) {
  const headers = createHeader(access_token);
  for (let i = 0; i < users.length; i++) {
    const res = await axios({
      method: "delete",
      url: `${zoomAPI}/phone/call_queues/${call_queue_id}/members/${users[i]}`,
      headers: headers,
    });
    console.log(`Removed User ${users[i]} from Call Queue ${call_queue_id}`);
  }
  const updatedCallQueueUsers = await getCallQueueUsers(
    access_token,
    call_queue_id
  );
  return updatedCallQueueUsers;
}

// get users to list in pick user - to add user to call queues
// NEED TO UPDATE TO NOT CHECK FOR BIZ HOURS JUST TO POPULATE THE USERS
export async function getUsers(access_token, call_queue_id) {
  console.log("Retrieving Users");
  const zoomUsers = [];
  const res = await axios({
    method: "get",
    url: `${zoomAPI}/phone/users`,
    headers: createHeader(access_token),
  });
  const currentCQUsers = await getCallQueueUsers(access_token, call_queue_id);
  const currentCQUsersIds = [];
  for (let i = 0; i < currentCQUsers.length; i++) {
    currentCQUsersIds.push(currentCQUsers[i].user_id);
  }
  for (let i = 0; i < res.data.users.length; i++) {
    if (!currentCQUsersIds.includes(res.data.users[i].id)) {
      zoomUsers.push({
        user_id: res.data.users[i].id,
        name: res.data.users[i].name,
        email: res.data.users[i].email,
      });
    }
  }
  return zoomUsers;
}

// get the business hours of a specific user
// NEED TO ACCOUNT FOR 24/7 HOURS
// Need to account for if the Call Queue doesn't allow for overriding hours. Cannot let them update user hours if the call queue doesn't allow for overriding hours
export async function getBusinessHours(access_token, extension_id) {
  console.log(`Retreiving Business Hours for Extension: ${extension_id}`);
  const res = await axios({
    method: "get",
    url: `${zoomAPI}/phone/extension/${extension_id}/call_handling/settings`,
    headers: createHeader(access_token),
  });
  const businessHours =
    res.data.business_hours[0].settings.custom_hours_settings;
  const adjustedBusinessHours = businessHours;
  for (let i = 0; i < adjustedBusinessHours.length; i++) {
    adjustedBusinessHours[i].weekday = adjustedBusinessHours[i].weekday - 1;
    adjustedBusinessHours[i].id = adjustedBusinessHours[i].weekday;
    adjustedBusinessHours[i].from = adjustedBusinessHours[i].from + ":00";
    adjustedBusinessHours[i].to = adjustedBusinessHours[i].to + ":00";
  }
  const allBusinessHours = {
    extension_id: extension_id,
    business_hours: adjustedBusinessHours,
  };
  return allBusinessHours;
}

// update the business hours from update user modal - some issues to address

// Need to account for updating hours on days that are not workdays - we don't allow for updating if the day is not an active workday (type 2)
// Need to account for updating if the day is a workday or not
// Need to account for if the Call Queue doesn't allow for overriding hours. Cannot let them update user hours if the call queue doesn't allow for overriding hours
export async function updateBusinessHours(
  access_token,
  extension_id,
  business_hours
) {
  console.log(`Updating Business Hours for Extension: ${extension_id}`);
  const adjustedBusinessHours = business_hours;
  for (let i = 0; i < adjustedBusinessHours.length; i++) {
    delete adjustedBusinessHours[i].id;
    adjustedBusinessHours[i].weekday = adjustedBusinessHours[i].weekday + 1;
    const splitFrom = adjustedBusinessHours[i].from.split(":");
    const updatedFrom = `${splitFrom[0]}:${splitFrom[1]}`;
    const splitTo = adjustedBusinessHours[i].to.split(":");
    const updatedTo = `${splitTo[0]}:${splitTo[1]}`;
    adjustedBusinessHours[i].from = updatedFrom;
    adjustedBusinessHours[i].to = updatedTo;
  }
  console.log(adjustedBusinessHours);
  const res = await axios({
    method: "patch",
    url: `${zoomAPI}/phone/extension/${extension_id}/call_handling/settings/business_hours`,
    headers: createHeader(access_token),
    data: {
      settings: {
        custom_hours_settings: adjustedBusinessHours,
        type: 2,
      },
      sub_setting_type: "custom_hours",
    },
  });
  console.log(res.status);
  if (res.status === 204) {
    const newBusinessHours = await getBusinessHours(access_token, extension_id);
    console.log("New Hours");
    console.log(newBusinessHours);
    return newBusinessHours;
  } else {
    console.log("error:");
    console.log(res.status);
  }
}
