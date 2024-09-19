import React, { useEffect, useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { DataGrid, GridToolbar  } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from "axios";
import moment from 'moment-jalaali';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ApiDataGrid = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [apiData, setApiData] = useState([]); // State to store API data

    const columns = [
        { field: "id", headerName: "ID" },
        { field: "user", headerName: "User", flex: 1 },
        { field: "browser", headerName: "Browser", flex: 1 },
        { field: "url", headerName: "URL", flex: 1 },
        { field: "host", headerName: "Host", flex: 1 },
        { field: "terminal", headerName: "Terminal", flex: 1 },
        { field: "time", headerName: "Time (Gregorian)", flex: 1 }, // Original time
        { field: "persianTime", headerName: "Time (Persian)", flex: 1 }, // New column for Persian time
        { field: "title", headerName: "Title", flex: 1 },
    ];

    function formatPersianDate(date) {
        return moment(date).format('jYYYY/jM/jD');
    }

    // Fetch API data from Express server
    useEffect(() => {
        const fetchApiData = async () => {
            try {
                const response = await axios.get('http://192.168.11.131:5000/api/data'); // Adjust URL as necessary
                // Transform the response data to include Persian date
                const transformedData = response.data.map(item => ({
                    ...item,
                    persianTime: formatPersianDate(item.time), // Convert time to Persian date
                }));
                setApiData(transformedData); // Set state with fetched and transformed data
            } catch (error) {
                console.error("Error fetching API data:", error);
            }
        };

        fetchApiData();
    }, []);

    // Function to export data to Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(apiData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'NetLog Data');
        XLSX.writeFile(workbook, 'NetLog_Data.xlsx');
    };

    // Function to export data to PDF
    const exportToPDF = () => {
        const input = document.getElementById("data-grid");
        
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 190;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save('NetLog_Data.pdf');
        });
    };

    return (
        <Box m="20px">
            <Typography variant="h4" gutterBottom color="textPrimary">
                NetLog
            </Typography>
            <Box
                mt="40px"
                height="75vh"
                flex={1}
                id="data-grid" // Add id for PDF export
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
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.gray[100]} !important`,
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
                    slots={{ toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    );
};

export default ApiDataGrid;