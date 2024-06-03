import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import { Table, Row, Col, Button, Input, CardBody } from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filters";
import './css/common.css'; // Import the CSS file

const TableContainer = ({
  columns,
  data,
  className,
  handleInputSearch,
  onPageChange
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );
  const [searchTerm, setSearchTerm] = useState('');
  const generateSortingIndicator = column => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
  };
  const handleInputSearchff = () => {
    if (searchTerm.trim() !== '') {
      handleInputSearch(searchTerm);
    }
  };

  const handleInputClean = () => {
    setSearchTerm('')
    onPageChange(1)
  };

  return (
    <Fragment>
      <Row className="mb-2">
        <Col md={3}>
        <div className="search-box me-xxl-2 my-3 my-xxl-0 d-inline-block">
            <div className="position-relative">
              <label htmlFor="search-bar-0" className="search-label">
                <input
                  onChange={e => {
                    setSearchTerm(e.target.value);
                   // handleInputChange(e.target.value);
                  }}
                  id="search-bar-0"
                  type="text"
                  className="form-control"
                  placeholder={` busque componentes`}
                  value={searchTerm || ""}
                />
              </label>
              <i className="bx bx-search-alt search-icon"></i>
            </div>
          </div>
          
        </Col>
        <Col md={1}>
          <div className="text-sm-start d-inline-block search-box me-xxl-2 my-3 my-xxl-0 ">
            <Button
              type="button"
              color="success"
              className="btn-table-procurar"
              onClick={handleInputSearchff}
            >
              Procurar
            </Button>
          </div>
        </Col>
        <Col md={2}>
          <div className="text-sm-start d-inline-block search-box me-xxl-2 my-3 ms-3 my-xxl-0 ">
            <Button
              type="button"
              color="warning"
              className="btn-table-procurar-constrast"
              onClick={handleInputClean}
            >
              Limpar
            </Button>
          </div>
        </Col>
      </Row>

      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map(headerGroup => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th key={column.id}>
                    <div className="mb-2" {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </div>
                    <Filter column={column} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <Fragment key={row.getRowProps().key}>
                  <tr>
                    {row.cells.map(cell => {
                      return (
                        <td key={cell.id} {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>


    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;
