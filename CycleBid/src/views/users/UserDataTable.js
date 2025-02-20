import { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import CustomChip from 'src/@core/components/mui/chip'
import { useRouter } from 'next/router'
import UserSearchToolbar from './UserSearchToolbar'
import { Divider } from '@mui/material'
import axiosInstanceNew from 'src/axiosInstanceNew'
import { formatDate } from 'src/@core/utils/dateFormat'
import { capitalizeFirstLetter, renderClient } from 'src/@core/utils/userUtils'

const statusObj = {
  "Inactive": { title: "Inactive", color: "error" },
  Active: { title: "Active", color: "success" },
  Block: { title: "Block", color: "error" },
};

export const fetchUserData = async (token, pageSize, fromDate, toDate, searchValue) => {
  try {
    console.log("Fetching user data...");
    console.log({ pageSize, fromDate, toDate, searchValue });

    let url = `/users?action=getUsers&pageSize=${pageSize}&nextToken=${token}`;

    if (fromDate && toDate) {
      url += `&fromDate=${fromDate}&toDate=${toDate}`;
    }

    if (searchValue) {
      const encodedSearchValue = encodeURIComponent(searchValue);
      url += searchValue.includes("@")
        ? `&searchByEmail=${encodedSearchValue}`
        : `&searchByUserName=${encodedSearchValue}`;
    }

    const data = await axiosInstanceNew.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });

    return data.status === "error" ? { data: [] } : data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { data: [] };
  }
};

export const fetchUserInitialData = async (pageSize, fromDate, toDate, searchValue, signal) => {
  try {
    console.log("Fetching user initial data...");
    console.log({ pageSize, fromDate, toDate, searchValue });

    let url = `/users?action=getUsers&pageSize=${pageSize}`;

    if (fromDate && toDate) {
      url += `&fromDate=${fromDate}&toDate=${toDate}`; // No encoding for "/"
    }

    if (searchValue) {
      const encodedSearchValue = encodeURIComponent(searchValue);
      url += searchValue.includes("@")
        ? `&searchByEmail=${encodedSearchValue}`
        : `&searchByUserName=${encodedSearchValue}`;
    }

    const data = await axiosInstanceNew.get(url, {
      signal,
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });

    return data.status === "error" ? { data: [] } : data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { data: [] };
  }
};

const UserDataTable = ({ tableData }) => {
  const router = useRouter()

  const [nextToken, setnextToken] = useState([tableData.nextToken])
  const [data, setData] = useState(tableData.data)
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filterTotalValue, setFilterTotalValue] = useState(0)
  const abortControllerRef = useRef(null);
  const latestRequestRef = useRef(0);
  const totalValue = tableData.totalCount ?? 0;

  const statusOptions = process.env.NEXT_PUBLIC_USER_MGT_ALL_STATUSES
    ? JSON.parse(process.env.NEXT_PUBLIC_USER_MGT_ALL_STATUSES)
    : [];

  const fetchData = async (nextToken) => {
    if (nextToken) {
      setIsLoading(true);
      try {
        const data = await fetchUserData(nextToken[nextToken.length - 1], paginationModel.pageSize, fromDate, toDate, filterName);
        setnextToken(prevTokens => [...prevTokens, data.nextToken]);
        setData(prevData => [...prevData, ...data.data]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchInitialData = async (pageSize) => {
    setIsLoading(true);
    try {
      const data = await fetchUserInitialData(pageSize, fromDate, toDate, filterName);
      setnextToken([data.nextToken]);
      setData(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
    const { page, pageSize } = newPaginationModel;
    if (pageSize !== paginationModel.pageSize) {
      setData([]);
      fetchInitialData(pageSize);
    }
    else if (page > paginationModel.page) {
      fetchData(nextToken, fromDate, toDate, filterName);
    }
    else if (page < paginationModel.page) {
      setIsLoading(true);
      const updatedTokens = nextToken.slice(0, nextToken.length - 1);
      setnextToken(updatedTokens);
      const newData = data.slice(0, nextToken.length * paginationModel.pageSize);
      setData(newData);
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchValue) => {
    setSearchText(searchValue);
    setFilterName(searchValue);
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize })

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const requestId = Date.now();
    latestRequestRef.current = requestId;

    if (!searchValue) {
      setFilteredData([]);
      setIsFilterApplied(false);
      setIsLoading(true);
      try {
        const response = await fetchUserInitialData(paginationModel.pageSize, fromDate, toDate, '', signal);
        if (latestRequestRef.current === requestId) {
          setData(response.data);
          setFilteredData(response.data);
          setFilterTotalValue(response.totalCount);
          setIsLoading(false);
        }
      } catch (error) {
        if (error.name !== "AbortError" && latestRequestRef.current === requestId) {
          console.error("Error fetching data:", error);
          setData([]);
          setIsLoading(false);
        }
      }
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchUserInitialData(paginationModel.pageSize, fromDate, toDate, searchValue, signal);
      if (latestRequestRef.current === requestId) {
        setData(response.data);
        console.log("********")
        console.log(response.data)
        setFilteredData(response.data);
        setFilterTotalValue(response.totalCount);
        setIsFilterApplied(true);
        setIsLoading(false);
      }
    } catch (error) {
      if (error.name !== "AbortError" && latestRequestRef.current === requestId) {
        setFilteredData([]);
        setIsFilterApplied(false);
        setIsLoading(false);
      }
    }
  };

  const handleStatusFilter = (status, role) => {
    if (status.length === 0 && role.length === 0) {
      setFilteredData(data);
      setIsFilterApplied(false);
      return;
    }
    let filteredRows = data;
    if (status.length !== 0) {
      filteredRows = filteredRows.filter(row => {
        return status.includes(capitalizeFirstLetter(row.userStatus));
      });
    }

    if (role.length !== 0) {
      filteredRows = filteredRows.filter(row => role.includes(row.userType));
    }
    const uniqueFilteredRows = Array.from(
      new Map(filteredRows.map(item => [item.cognitoUserId, item])).values()
    );
    setFilteredData(uniqueFilteredRows);
    setIsFilterApplied(true);
  };

  const handleDateFilter = async (start, end) => {
    setIsFilterApplied(start !== null && end !== null);

    if (start && end) {
      setIsLoading(true);
      try {
        const formattedStartDate = new Date(start).toLocaleDateString('en-US');
        const formattedEndDate = new Date(end).toLocaleDateString('en-US');

        const data = await fetchUserInitialData(
          paginationModel.pageSize,
          formattedStartDate, formattedEndDate,
          filterName
        );

        setFromDate(formattedStartDate);
        setToDate(formattedEndDate);
        setData(data.data);
        setFilteredData(data.data);
        setFilterTotalValue(data.totalCount);
        setIsFilterApplied(true);
      } catch (error) {
        console.error("Error filtering data:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      setFromDate(null);
      setToDate(null);
      try {
        const data = await fetchUserInitialData(
          paginationModel.pageSize,
          null, null, filterName
        );
        setData(data.data);
        setFilteredData(data.data);
        setFilterTotalValue(data.totalCount);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const columns = [
    {
      flex: 0.25,
      minWidth: 290,
      field: 'auctionUsers',
      headerName: 'Auction Users',
      renderCell: params => {
        const { row } = params;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {renderClient({ username: row.username, profileImage: row.profileImage[0] })}
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, maxWidth: '100%' }}>
              <Typography
                variant='body2'
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {row.username ?? '-'}
              </Typography>
              <Typography
                variant='caption'
                sx={{
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {row.email ?? '-'}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'CONTACT',
      field: 'contact',
      valueGetter: params => new Date(params.value),
      renderCell: params => (

        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.contactNumber ?? '-'}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'location',
      headerName: 'LOCATION',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.city ?? '-'}
        </Typography>
      )
    },
    {
      flex: 0.125,
      field: 'userType',
      minWidth: 110,
      headerName: 'User Type',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.userType ?? '-'}
        </Typography>
      )
    },
    {
      flex: 0.175,
      type: 'date',
      minWidth: 120,
      headerName: 'Joined Date',
      field: 'createdDate',
      valueGetter: params => new Date(params.value),
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.userCreateDate ? formatDate(params.row.userCreateDate) : '-'}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: params => {
        const getUserStatus = (user) => {
          if (user.enabled === true) {
            return "Active";
          } else if (user.enabled === false) {
            return "Inactive";
          } else {
            return "Blocked";
          }
        };

        const status = (() => {
          const userStatusKey = params.row ? getUserStatus(params.row) || '' : '';
          return statusOptions.includes(userStatusKey)
            ? statusObj[userStatusKey]
            : { title: userStatusKey, color: "secondary" };
        })();

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'action',
      headerName: 'Actions',
      sortable: false,
      renderCell: params => {

        const handleView = (mail) => {
          if (!mail) {
            console.error('Invalid Mail');
            return;
          }
          localStorage.setItem('userId', mail);
          router.replace(`/users/userview/${mail}`);
        }
        return (
          <button
            onClick={() => handleView(params.row.email)}
            style={{
              padding: '4px 8px',
              backgroundColor: 'transparent',
              color: 'text.primary',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Typography variant='body2' sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              View
            </Typography>
          </button>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader
        title={`All Users (${isFilterApplied ? `${filterTotalValue ?? 0}/${totalValue ?? 0}` : totalValue ?? 0})`}
      />
      <Divider />
      <UserSearchToolbar
        value={searchText}
        clearSearch={() => handleSearch('')}
        onChange={event => handleSearch(event.target.value)}
        roleOptions={['Seller', 'Buyer']}
        statusOptions={statusOptions}
        handleStatusFilter={(filter, role) => handleStatusFilter(filter, role)}
        handleDateFilter={(start, end) => handleDateFilter(start, end)}
        sx={{
          marginBottom: 2,
          padding: '8px 16px',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px',
          zIndex: 2
        }}
      />
      <DataGrid
        autoHeight
        columns={columns}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        rowCount={tableData.totalCount}
        onPaginationModelChange={handlePaginationChange}
        getRowId={(row) => row.cognitoUserId}
        loading={isLoading}
        pageSize={paginationModel.pageSize}
        rows={isLoading ? [] : filteredData.length || isFilterApplied ? filteredData : data}
        rowHeight={data?.length === 0 || isLoading ? 100 : 60}
        localeText={{ noRowsLabel: 'No data available' }}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            color: '#333',
            fontWeight: '600',
            fontSize: '0.9rem'
          }
        }}
      />
    </Card>
  )
}

export default UserDataTable
