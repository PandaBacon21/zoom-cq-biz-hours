import axios from "axios";
import { Buffer } from "buffer";

const zoomAuth = "https://zoom.us/oauth/";
const zoomAPI = "https://api.zoom.us/v2/";

let currentToken = { access_token: "", expires: 0 };

function createHeader(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

// Check if the token is more than 45 min old (Zoom toke will expire after 1 hour)
function checkAccessTokenExpire() {
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - currentToken.expires;

  // Return True if 45 min have passed since the last token was retrieved
  return timeDifference >= 2700000;
}

// Check our current token or get a new one
export async function getAccessToken() {
  console.log("Checking for Access Token");
  if (currentToken.access_token === "" || checkAccessTokenExpire()) {
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

export async function getCallQueues(access_token) {
  console.log("Retrieving Call Queues");
  let callQueues = [];
  let res = await axios({
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

export async function getCallQueueUsers(access_token, call_queue_id) {
  console.log(`Retrieving Users for Call Queue ${call_queue_id}`);
  let callQueueUsers = [];
  let res = await axios({
    method: "get",
    url: `${zoomAPI}/phone/call_queues/${call_queue_id}/members`,
    headers: createHeader(access_token),
  });
  for (let i = 0; i < res.data.call_queue_members.length; i++) {
    let allBusinessHours = await getBusinessHours(
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

export async function updateCallQueueUsers(access_token, call_queue_id, user) {
  let res = await axios({
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
  let updatedCallQueueUsers = await getCallQueueUsers(
    access_token,
    call_queue_id
  );
  return updatedCallQueueUsers;
}

export async function removeCallQueueUsers(access_token, call_queue_id, users) {
  const headers = createHeader(access_token);
  for (let i = 0; i < users.length; i++) {
    let res = await axios({
      method: "delete",
      url: `${zoomAPI}/phone/call_queues/${call_queue_id}/members/${users[i]}`,
      headers: headers,
    });
    console.log(`Removed User ${users[i]} from Call Queue ${call_queue_id}`);
  }
  let updatedCallQueueUsers = await getCallQueueUsers(
    access_token,
    call_queue_id
  );
  return updatedCallQueueUsers;
}

// NEED TO UPDATE TO NOT CHECK FOR BIZ HOURS JUST TO POPULATE THE USERS
export async function getUsers(access_token, call_queue_id) {
  console.log("Retrieving Users");
  let zoomUsers = [];
  let res = await axios({
    method: "get",
    url: `${zoomAPI}/phone/users`,
    headers: createHeader(access_token),
  });
  let currentCQUsers = await getCallQueueUsers(access_token, call_queue_id);
  let currentCQUsersIds = [];
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

// NEED TO ACCOUNT FOR 24/7 HOURS
export async function getBusinessHours(access_token, extension_id) {
  console.log(`Retreiving Business Hours for Extension: ${extension_id}`);
  let res = await axios({
    method: "get",
    url: `${zoomAPI}/phone/extension/${extension_id}/call_handling/settings`,
    headers: createHeader(access_token),
  });
  const businessHours =
    res.data.business_hours[0].settings.custom_hours_settings;
  let adjustedBusinessHours = businessHours;
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

// FINISH HANDLING STRIPPING THE :00 OFF THE END OF EACH TIME IN ORDER TO SUBMIT TO API
export async function updateBusinessHours(
  access_token,
  extension_id,
  business_hours
) {
  console.log(`Updating Business Hours for Extension: ${extension_id}`);
  let adjustedBusinessHours = business_hours;
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
  let res = await axios({
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
