import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Divider,
  Toolbar,
  Typography,
  Grid,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Skeleton,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserTasks } from "../apiServices";
import TableShimmer from "./Shimmer/TableShimmer";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const columns = [
  { id: "_id", label: "Id" },
  { id: "title", label: "Title" },
  { id: "description", label: "Description" },
  { id: "status", label: "Status" },
  { id: "priority", label: "Priority" },
  { id: "deadline", label: "Deadline" },
  { id: "action", label: "Action" },
];

function Tasks() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(getCurrentUserTasks());
        setRows(data.response.tasks);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const filterRow = useMemo(() => {
    if (!searchTerm) {
      return rows;
    }

    return rows.filter((row) => {
      return Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [rows, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        marginTop: 2,
        boxShadow: theme.shadows[3],
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Toolbar>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h6" noWrap component="div">
              Data Table
            </Typography>
          </Grid>
          <Grid item>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Search>
          </Grid>
        </Grid>
      </Toolbar>
      <Divider />
      <TableContainer>
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{
            borderCollapse: "separate",
            borderSpacing: "0",
            "& .MuiTableCell-root": {
              borderBottom: "1px solid rgba(224, 224, 224, 1)",
            },
            "& .MuiTableRow-root:last-child .MuiTableCell-root": {
              borderBottom: 0,
            },
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableShimmer columns={columns} rowsPerPage={rowsPerPage}/>
            )
              : filterRow
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row._id}
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.light,
                              0.1
                            ),
                          },
                        }}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <>
                            <TableCell key={column.id} align={column.align}>
                              {column.id === "deadline"
                                ? new Date(value).toLocaleDateString()
                                : null}

                              {column.id === "status" ? (
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    bgcolor:
                                      value === "completed"
                                        ? "success.main"
                                        : value === "in_progress"
                                        ? "info.main"
                                        : "warning.main",
                                    color: "primary.contrastText",
                                    p: 1,
                                    borderRadius: 2,
                                    minWidth: 90, // Set a default width
                                    textAlign: "center", // Center the text
                                  }}
                                >
                                  {value}
                                </Box>
                              ) : null}
                              {column.id === "priority" ? (
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    bgcolor:
                                      value === "high"
                                        ? "error.main"
                                        : value === "medium"
                                        ? "warning.main"
                                        : "info.main",
                                    color: "primary.contrastText",
                                    p: 1,
                                    borderRadius: 2,
                                    minWidth: 80, // Set a default width
                                    textAlign: "center", // Center the text
                                  }}
                                >
                                  {value}
                                </Box>

                              ) : null}
                              {column.id !== "deadline" &&
                              column.id !== "status" &&
                              column.id !== "priority"
                                ? value
                                : null}
                                
                            </TableCell>
                            
                            </>
                          ); 
                        }
                        )}
                        
                      </TableRow>
                      
                    );
                  })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default Tasks;