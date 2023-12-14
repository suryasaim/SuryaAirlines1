import React, { useEffect, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import axios from 'axios';
import Layout from '../layout';
const TableReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7200/api/CsvCarRecords/GetCarRecordsCsvData');
        console.log('API Response:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      { Header: 'BodyType', accessor: 'bodyType', Cell: ({ value }) => value || 'N/A' },
      { Header: 'Brand', accessor: 'brand' ,Cell: ({ value }) => value || 'N/A'},
      { Header: 'Colour', accessor: 'colourExtInt', Cell: ({ value }) => value || 'N/A' },
      { Header: 'Fuel Consumption', accessor: 'fuelConsumption', Cell: ({ value }) => value || 'N/A' },
      { Header: 'Fuel Type', accessor: 'fuelType', Cell: ({ value }) => value || 'N/A' },
      { Header: 'Location', accessor: 'location' ,Cell: ({ value }) => value || 'N/A'},
      { Header: 'Model', accessor: 'model' ,Cell: ({ value }) => value || 'N/A'},
      { Header: 'Seats', accessor: 'seats', Cell: ({ value }) => value || 'N/A' },
      { Header: 'Transmission', accessor: 'transmission',Cell: ({ value }) => value || 'N/A' },
      { Header: 'Used Or New', accessor: 'usedOrNew',Cell: ({ value }) => value || 'N/A' },
      { Header: 'Year', accessor: 'year', Cell: ({ value }) => value || 'N/A' },
      { Header: 'Kilometres', accessor: 'sumOfKilometres', Cell: ({ value }) => value || 'N/A' },
      { Header: 'Price', accessor: 'sumOfPrice', Cell: ({ value }) => value || 'N/A' },
    ],
    []
  );
  

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageCount,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 30 },
    },
    usePagination
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Layout>
      <h2>All Vehicas Report</h2>
      <div style={{ overflowX: 'auto' }}>
        <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    style={{
                      borderBottom: '2px solid #ddd',
                      borderRight: '1px solid #ddd',
                      borderTop: '1px solid #ddd', // Add border for column separation
                      padding: '8px',
                      textAlign: 'left',
                    }}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} style={{ borderBottom: '1px solid #ddd' }}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        borderBottom: '1px solid #ddd',
                        borderRight: '1px solid #ddd',
                        borderLeft: '1px solid #ddd',
                        borderTop: '1px solid #ddd', // Add border for column separation
                        padding: '8px',
                        textAlign: 'left',
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div>
      <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          style={{ background: 'green', color: 'white', padding: '8px', border: 'none', cursor: 'pointer' }}
        >
          {'<<'}
        </button>{' '}
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          style={{ background: 'green', color: 'white', padding: '8px', border: 'none', cursor: 'pointer' }}
        >
          {'<'}
        </button>{' '}
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          style={{ background: 'green', color: 'white', padding: '8px', border: 'none', cursor: 'pointer' }}
        >
          {'>'}
        </button>{' '}
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          style={{ background: 'green', color: 'white', padding: '8px', border: 'none', cursor: 'pointer' }}
        >
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{' '}
        </span>
      </div>
    </Layout>
  );
};

export default TableReport;
