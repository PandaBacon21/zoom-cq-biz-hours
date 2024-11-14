import express from "express";
import dotenv from "dotenv/config";

import {
  getAccessToken,
  getCallQueues,
  getCallQueueUsers,
  getUsers,
  removeCallQueueUsers,
  updateCallQueueUsers,
  getBusinessHours,
  updateBusinessHours,
} from "./zoom.js";

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on PORT: ${port}`);
});

app.get("/api/get-call-queues", express.json(), async (req, res) => {
  console.log("Endpoint: /api/get-call-queues");
  const accessToken = await getAccessToken();
  const callQueues = await getCallQueues(accessToken);

  res.send(callQueues);
});

app.get("/api/get-call-queue-users", express.json(), async (req, res) => {
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  console.log(fullUrl);
  console.log("Endpoint: /api/get-call-queue-users");
  let callQueueId = req.query.callQueueId;
  const access_token = await getAccessToken();
  const callQueueUsers = await getCallQueueUsers(access_token, callQueueId);

  res.send(callQueueUsers);
});

app.post("/api/update-call-queue-user", express.json(), async (req, res) => {
  console.log("Endpoint: /api/update-call-queue-user");
  let userToUpdate = { email: req.body.email, id: req.body.user_id };
  const access_token = await getAccessToken();
  const updatedCallQueue = await updateCallQueueUsers(
    access_token,
    req.body.call_queue_id,
    userToUpdate
  );
  res.send(updatedCallQueue);
});

app.delete("/api/remove-call-queue-users", express.json(), async (req, res) => {
  console.log("Endpoint: /api/remove-call-queue-user");

  const access_token = await getAccessToken();
  const updatedCallQueue = await removeCallQueueUsers(
    access_token,
    req.body.call_queue_id,
    req.body.users
  );
  res.send(updatedCallQueue);
});

app.get("/api/get-users", express.json(), async (req, res) => {
  console.log("Endpoint: /api/get-users");
  let callQueueId = req.query.callQueueId;
  const access_token = await getAccessToken();
  const zoomUsers = await getUsers(access_token, callQueueId);

  res.send(zoomUsers);
});

app.get("/api/get-business-hours", express.json(), async (req, res) => {
  console.log("Endpoint: get-business-hours");
  const extensionId = req.query.extension_id;
  const access_token = await getAccessToken();
  const businessHours = await getBusinessHours(access_token, extensionId);

  res.send(businessHours);
});

app.patch("/api/update-business-hours", express.json(), async (req, res) => {
  console.log("Endpoint: update-business-hours");
  const extensionId = req.query.extension_id;
  const businessHours = req.body.business_hours;
  console.log({ extensionId: extensionId, businessHours: businessHours });
  const access_token = await getAccessToken();
  const newBusinessHours = await updateBusinessHours(
    access_token,
    extensionId,
    businessHours
  );
  res.send(newBusinessHours);
});
