import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import { visuallyHidden } from "@mui/utils";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import Popup from "../Popup/Popup";
import axios from "axios";
import "./Dataproducttable.css";
function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "nameProduct",
    numeric: false,
    disablePadding: true,
    label: "ชื่อสินค้า",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "ราคา",
  },
  {
    id: "weight",
    numeric: true,
    disablePadding: false,
    label: "น้ำหนัก",
  },
  {
    id: "typeWeight",
    numeric: true,
    disablePadding: false,
    label: "ประเภทน้ำหนัก",
  },
  {
    id: "action",
    numeric: true,
    disablePadding: false,
    label: "Action",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id !== "action" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <Table>{headCell.label}</Table>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, handleDelete } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => handleDelete()}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
export default function Dataproducttable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const [rowsx, setRowsx] = useState([]);
  const [typeEditData, setTypeEditData] = useState(null);
  const [_id, set_id] = useState(null);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(() => {
    if (rows.length === 0) return null;
    return stableSort(rows, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [order, orderBy, page, rowsPerPage, rows]);

  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopupAddData = (event) => {
    event.stopPropagation();
    setTypeEditData("adddata");
    setShowPopup(true);
  };
  const handleOpenPopupEditData = (event, row) => {
    event.stopPropagation();
    setTypeEditData("editdata");
    setProduct({
      nameProduct: row.nameProduct,
      price: row.price,
      typeWeight: row.typeWeight,
      weight: row.weight,
    });
    set_id(row._id);
    setShowPopup(true);
  };
  const handleOpenPopupDelete = async (event, _id) => {
    console.log("delete");
    event.stopPropagation();
    await axios
      .delete("http://localhost:5000/api/product/" + _id)
      .then((res) => {
        console.log(res);
        getdataProduct();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleClosePopup = () => {
    setProduct({ nameProduct: "", price: "", weight: "", typeWeight: "" });
    setShowPopup(false);
  };
  const handleDelete = () => {
    console.log(selected);
  };
  const [product, setProduct] = useState({
    nameProduct: "",
    price: "",
    weight: "",
    typeWeight: "",
  });
  const handleChange = (event) => {
    console.log("Product", product);
    const { name, value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };
  const handleAddDataAndEditData = async () => {
    if (typeEditData === "adddata") {
      console.log("productAdddata", product);
      await axios
        .post("http://localhost:5000/api/product/", product)
        .then((res) => {
          console.log(res);
          setShowPopup(false);
          getdataProduct();
          setProduct({
            nameProduct: "",
            price: "",
            weight: "",
            typeWeight: "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (typeEditData === "editdata") {
      await axios
        .put("http://localhost:5000/api/product/" + _id, product)
        .then((res) => {
          setShowPopup(false);
          getdataProduct();
          setProduct({
            nameProduct: "",
            price: "",
            weight: "",
            typeWeight: "",
          });
          setTypeEditData(null);
          set_id(null);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const getdataProduct = async () => {
    await axios
      .get("http://localhost:5000/api/product")
      .then((res) => {
        console.log(res);
        setRows(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getdataProduct();
  }, []);
  return (
    <Box sx={{ width: "100%", zIndex: 4 }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <div
          style={{
            textAlign: "end",
            padding: "20px",
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleOpenPopupAddData}
          >
            Add Product
          </Button>
          {showPopup && (
            <Popup
              onClose={handleClosePopup}
              handleChange={handleChange}
              product={product}
              handleAddDataAndEditData={handleAddDataAndEditData}
              typeEditData={typeEditData}
            />
          )}
        </div>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          handleDelete={handleDelete}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {console.log(rows)}
              {visibleRows ? (
                visibleRows.map((row, index) => {
                  console.log(index);
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        className="table-cell"
                      >
                        {row.nameProduct.length > 20
                          ? row.nameProduct.slice(0, 20) + "..."
                          : row.nameProduct}
                      </TableCell>
                      <TableCell align="right">
                        {row.price.length > 20
                          ? row.price.slice(0, 20) + "..."
                          : row.price}
                      </TableCell>
                      <TableCell align="right">
                        {row.weight.length > 20
                          ? row.weight.slice(0, 20) + "..."
                          : row.weight}
                      </TableCell>
                      <TableCell align="right">{row.typeWeight}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="Edit"
                          color="warning"
                          onClick={(e) => handleOpenPopupEditData(e, row)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="Delete"
                          color="error"
                          onClick={(e) => handleOpenPopupDelete(e, row._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>Loading...</TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
