import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import axios from "axios";
import { CallQueueContext } from "../context/CallQueueContext";
import { UserContext } from "../context/UserContext";

export default function PickUser() {
  const { callQueue } = useContext(CallQueueContext);
  const { listZoomUsers, setListZoomUsers, selectedUser, setSelectedUser } =
    useContext(UserContext);

  const [loading, setLoading] = useState(false);

  // Open Select to pick a new user
  const handleOpen = async (event) => {
    try {
      setSelectedUser(null);
      setLoading(true);
      const res = await axios({
        method: "get",
        url: "/api/get-users",
        params: {
          callQueueId: callQueue.id,
        },
      });
      setListZoomUsers(res.data);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  // Pick a user
  const handleChange = (event) => {
    console.log(event.target.value);
    setSelectedUser(event.target.value);
  };

  return (
    <Box minWidth={200} maxWidth={300}>
      <FormControl fullWidth>
        <InputLabel>
          <Typography fontWeight="bold">Add User</Typography>
        </InputLabel>
        <Select
          value={selectedUser ? selectedUser : ""}
          label="Add User"
          onOpen={handleOpen}
          onChange={handleChange}
        >
          {!loading ? (
            listZoomUsers.map((user, index) => {
              return (
                <MenuItem key={index} value={user}>
                  {user.name}
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
