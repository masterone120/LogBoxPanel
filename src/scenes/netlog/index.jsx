import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from "axios"; 

const ApiDataGrid = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [apiData, setApiData] = useState([]); // State to store API data

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "user", headerName: "User", flex: 1 },
    { field: "browser", headerName: "Browser", flex: 1 },
    { field: "url", headerName: "URL", flex: 1 },
    // { field: "event", headerName: "Event", flex: 1 },
    { field: "host", headerName: "Host", flex: 1 },
    // { field: "pid", headerName: "PID", flex: 1 },
    // { field: "session", headerName: "Session", flex: 1 },
    { field: "terminal", headerName: "Terminal", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
  ];

  // Fetch API data from Express server
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const response = await axios.get('http://192.168.11.131:5000/api/data'); // Adjust URL as necessary
        setApiData(response.data); // Set state with fetched data
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchApiData();
  }, []);

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        NetLog
      </Typography>
      <Box
        mt="40px"
        height="75vh"
        flex={1}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={apiData} // Use fetched API data here
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default ApiDataGrid;