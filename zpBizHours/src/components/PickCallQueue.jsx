import React, { useState } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  CircularProgress,
  Typography,
} from "@mui/material";

import axios from "axios";

export default function PickCallQueue({ setCallQueue, setCallQueueUsers }) {
  const [loading, setLoading] = useState(false);
  const [availableQueue, setAvailableQueue] = useState([]);

  // when picker is opened, call backed to get a list of queues to choose from
  const handleOpen = async (event) => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: "/api/get-call-queues",
      });
      setAvailableQueue(res.data);
      // console.log(res.data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  // call backend to retrieve the most recent list of users in queue picked
  const fetchCallQueueUsers = async (callQueue) => {
    try {
      setCallQueueUsers([]);
      const res = await axios({
        method: "get",
        url: "/api/get-call-queue-users",
        params: { callQueueId: callQueue.id },
      });
      const users = res.data;
      console.log(users);
      setCallQueueUsers(users);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (event) => {
    setCallQueue(event.target.value);
    fetchCallQueueUsers(event.target.value);
  };

  return (
    <Box minWidth={200} maxWidth={300}>
      <FormControl fullWidth>
        <InputLabel>
          <Typography fontWeight="bold">Pick Call Queue</Typography>
        </InputLabel>
        <Select
          value=""
          label="Call Queues"
          onOpen={handleOpen}
          onChange={handleChange}
        >
          {!loading ? (
            availableQueue.map((queue, index) => {
              return (
                <MenuItem key={index} value={queue}>
                  {queue.name}
                </MenuItem>
              );
            })
          ) : (
            <CircularProgress />
          )}
        </Select>
      </FormControl>
    </Box>
  );
}
