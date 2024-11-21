import { useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import {
  convertTime,
  getDay,
  getWorkday,
  updateCallQueueUserBusinessHours,
} from "../utilities/utilities";

import axios from "axios";

dayjs.extend(customParseFormat);

export default function UpdateUserModal({
  open,
  handleClose,
  selectedUser,
  currentHours,
  callQueueUsers,
}) {
  const [newHours, setNewHours] = useState(null);

  // Send updated hours to the backend to update Zoom
  const updateUserBusinessHours = async () => {
    try {
      const res = await axios({
        method: "patch",
        url: "/api/update-business-hours",
        params: { extension_id: selectedUser.extension_id },
        data: {
          business_hours: newHours,
        },
      });
      const hours = res.data;
      console.log(res.data);
      console.log(hours.business_hours);
      console.log(hours.extension_id);
      updateCallQueueUserBusinessHours(callQueueUsers, hours);
      handleClose();
    } catch (e) {
      console.log(e);
    }
  };

  // Handle change of time in the FROM column
  const handleFromChange = (newValue, params) => {
    console.log(newValue);
    console.log(params.row.id);

    const updatedHours = [...currentHours];
    const newTime = convertTime(newValue);

    updatedHours[params.row.id].from = newTime;
    setNewHours(updatedHours);
    console.log(updatedHours);
  };

  // Handle Change of time in the TO column (need to see if this can be conbined to a single function -- would need to be able to identify the column that changed )
  const handleToChange = (newValue, params) => {
    console.log(newValue);
    console.log(params.row.id);

    const updatedHours = [...currentHours];
    const newTime = convertTime(newValue);

    updatedHours[params.row.id].to = newTime;
    setNewHours(updatedHours);
    console.log(updatedHours);
  };

  // Columns for datagrid
  const columns = [
    {
      field: "weekday",
      headerName: "Day",
      width: 120,
      valueGetter: getDay,
    },
    {
      field: "type",
      headerName: "Workday",
      width: 120,
      valueGetter: getWorkday,
    },
    {
      field: "from",
      headerName: "From",
      width: 180,
      renderCell: (params) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            defaultValue={dayjs(params.row.from, "HH:mm:ss")}
            onChange={(newValue) => handleFromChange(newValue, params)}
          />
        </LocalizationProvider>
      ),
    },
    {
      field: "to",
      headerName: "To",
      width: 180,
      renderCell: (params) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            defaultValue={dayjs(params.row.to, "HH:mm:ss")}
            onChange={(newValue) => handleToChange(newValue, params)}
          />
        </LocalizationProvider>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="title"
        aria-describedby="description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 710,
            height: "auto",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Weekly Business Hours
          </Typography>
          {currentHours !== null ? (
            <DataGrid
              columns={columns}
              rows={currentHours}
              hideFooterPagination={true}
              hideFooterSelectedRowCount
            />
          ) : (
            <CircularProgress />
          )}
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ float: "left", margin: 1 }}
          >
            Close
          </Button>
          {newHours ? (
            <Button
              variant="contained"
              sx={{ float: "right", margin: 1 }}
              onClick={updateUserBusinessHours}
            >
              Update
            </Button>
          ) : null}
        </Box>
      </Modal>
    </>
  );
}
