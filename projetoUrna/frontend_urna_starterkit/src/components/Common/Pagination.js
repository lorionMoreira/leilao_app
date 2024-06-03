import React, { useState } from 'react';
import './css/common.css'; // Import the CSS file
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//  const [pages, setPages] = useState([]);

  // Calculate the array of page numbers
  /*
  useState(() => {
    const pageArray = [];
    for (let i = 1; i <= totalPages; i++) {
      pageArray.push(i);
    }
    setPages(pageArray);
  }, [totalPages]);
  */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  const handlePreviousPage = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    handlePageChange(currentPage + 1);
  };
  const handlePageInputChange = (event) => {
    const page = parseInt(event.target.value, 10);
    if (!isNaN(page)) {
      handlePageChange(page);
    }
  };

  return (
    <div style={{ textAlign: 'right' }}>
      <button
        className={`btn btn-primary ${currentPage === 1 ? 'disabled' : ''} me-2`}
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
      >
        &lt; Previous
      </button>
      <span className=" me-2">
      <b>Page</b>   {currentPage} <b>of</b>  {totalPages}
      </span>
      <input
        type="number"
        min="1"
        className="form-control me-2"
        style={{ width: '70px', display: 'inline-block', verticalAlign: 'middle' }}
        max={totalPages}
        value={currentPage}
        onChange={handlePageInputChange}
      />
      {/* 
      {pages.map((page) => (
        <button className={`btn btn-primary ${currentPage === page ? 'active' : ''}`}
          key={page}
          onClick={() => handlePageChange(page)}
          disabled={currentPage === page}
        >
          {page}
        </button>
      ))}
      */}
        <button
        className={`btn btn-primary ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
