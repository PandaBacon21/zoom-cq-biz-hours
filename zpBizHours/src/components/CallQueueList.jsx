import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import UpdateUserModal from "./UpdateUserModal.jsx";
import { getTodaysHours } from "../utilities/utilities.js";
import { CallQueueContext } from "../context/CallQueueContext.jsx";
import { UserContext } from "../context/UserContext.jsx";

export default function CallQueueList() {
  const { callQueue, callQueueUsers, setCallQueueUsers } =
    useContext(CallQueueContext);
  const {
    selectedUser,
    setSelectedUser,
    rowSelectionModel,
    setRowSelectionModel,
  } = useContext(UserContext);

  const [open, setOpen] = useState(false);
  const [currentHours, setCurrentHours] = useState(null);

  const handleOpen = () => {
    // getUserBusinessHours();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setCurrentHours(null);
  };
  useEffect(() => {
    // when selectedUser changes, call backed to retrieve selectedUser business hours
    const getUserBusinessHours = async () => {
      try {
        const res = await axios({
          method: "get",
          url: "/api/get-business-hours",
          params: { extension_id: selectedUser.extension_id },
        });
        const hours = res.data;
        setCurrentHours(hours.business_hours);
        console.log(hours.business_hours);
      } catch (e) {
        console.log(e);
      }
    };
    if (open !== false) {
      getUserBusinessHours();
    }
  }, [open]);

  // Columns for datagrid
  const columns = [
    { field: "name", headerName: "User Name", width: 250 },
    { field: "receive_call", headerName: "Receive Call Status", width: 250 },
    {
      field: "all_business_hours",
      headerName: "Today's Business Hours",
      width: 250,
      valueGetter: (value) => {
        return getTodaysHours(value);
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Update",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ManageAccountsIcon color="primary" fontSize="large" />}
          label="Update"
          onClick={() => {
            setSelectedUser(callQueueUsers[params.id - 1]);
            handleOpen();
            console.log(callQueueUsers[params.id - 1]);
          }}
        />,
      ],
    },
  ];

  return (
    <>
      <Paper elevation={2} sx={{ width: "85%", height: "50%", margin: 2 }}>
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{ marginTop: 3 }}
          gutterBottom
        >
          {callQueue.name}
        </Typography>
        {callQueueUsers.length > 0 ? (
          <Box sx={{ width: "100%" }}>
            <DataGrid
              columns={columns}
              rows={callQueueUsers}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
              }}
              rowSelectionModel={rowSelectionModel}
            />
          </Box>
        ) : (
          <CircularProgress />
        )}
        <UpdateUserModal
          open={open}
          handleClose={handleClose}
          selectedUser={selectedUser}
          currentHours={currentHours}
          callQueueUsers={callQueueUsers}
          setCallQueueUsers={setCallQueueUsers}
        />
      </Paper>
    </>
  );
}
