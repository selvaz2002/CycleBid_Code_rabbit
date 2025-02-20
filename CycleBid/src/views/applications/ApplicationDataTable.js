import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import axiosInstanceNew from 'src/axiosInstanceNew'
import { Box, Card, CardHeader, Typography, Divider, LinearProgress } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import CustomChip from 'src/@core/components/mui/chip'
import ApplicationSearch from './ApplicationSearch'
import { formatDate } from 'src/@core/utils/dateFormat'
import {  renderClient } from 'src/@core/utils/userUtils'

const statusObj = {
  1: { title: 'submitted', color: 'success' },
  2: { title: 'draft', color: 'info' },
  3: { title: 'rejected', color: 'error' },
}
const userTypeMapping = {
  submitted: 1,
  draft: 2,
  rejected: 3
};
const stepProgressMapping = {
  1: 10,
  2: 25,
  3: 50,
  4: 75,
  5: 100,
};

const fetchUserData = async (nextPage, pageSize, status, fromDate, toDate, searchValue, signal) => {
  try {
    const encodedSearchValue = encodeURIComponent(searchValue);
    let url = `get-motorcycle-details?page=${nextPage}&limit=${pageSize}`;
    if (status) {
      if (Array.isArray(status)) {
        status.forEach(s => url += `&status=${s}`);
      } else {
        url += `&status=${status}`;
      }
    }
    if (fromDate) url += `&fromDate=${fromDate}`;
    if (toDate) url += `&toDate=${toDate}`;
    if (searchValue) url += `&search=${encodedSearchValue}`;
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    };
    if (signal) {
      config.signal = signal;
    }
    const response = await axiosInstanceNew.get(url, config);
    if (response.status === 'error') {
      return { data: [] };
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return { data: [] };
  }
};

const TableColumns = ({ tableData, paginationData }) => {

  const [data, setData] = useState(tableData || []);
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState('')
  const [filterName, setFilterName] = useState('')
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [nextPage, setNextPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const latestRequestRef = useRef(0);

  const fetchData = async (nextPage, pageSize, filterStatus, fromDate, toDate, filterName, signal) => {
    if (nextPage) {
      setIsLoading(true);
      try {
        const data = await fetchUserData(nextPage, pageSize, filterStatus, fromDate, toDate, filterName, null);
        setData(prevData => {
          const updatedData = [...prevData];
          const startIdx = (nextPage - 1) * paginationModel.pageSize;
          if (Array.isArray(data.motorcycle)) {
            updatedData.splice(startIdx, data.motorcycle.length, ...data.motorcycle);
          } else {
            console.error("data.data is not an array:", data.data);
          }
          return updatedData;
        });
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
      const data = await fetchUserData(1, pageSize, filterStatus, fromDate, toDate, filterName, null);
      setData(data.motorcycle);
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
      setIsLoading(true)
      setPaginationModel({ page: 0, pageSize });
      setNextPage(1)
      setData([]);
      fetchInitialData(pageSize);
    }
    else if (page > paginationModel.page) {
      const updatePage = nextPage + 1
      fetchData(updatePage, paginationModel.pageSize, filterStatus, fromDate, toDate, filterName, null);
      setNextPage(updatePage)
    }
    else if (page < paginationModel.page) {
      setIsLoading(true);
      const updatePage = nextPage - 1
      setData(data);
      setNextPage(updatePage)
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchValue) => {
    setSearchText(searchValue);
    setFilterName(searchValue);
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
    setNextPage(1);
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
        const response = await fetchUserData(1, paginationModel.pageSize, filterStatus, fromDate, toDate, searchValue, signal);
        if (latestRequestRef.current === requestId) {
          setData(response.motorcycle);
          setFilteredData(data);
          setIsFilterApplied(true);
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
      const response = await fetchUserData(1, paginationModel.pageSize, filterStatus, fromDate, toDate, searchValue, signal);
      if (latestRequestRef.current === requestId) {
        setData(response.motorcycle);
        setFilteredData(response);
        setIsFilterApplied(true);
        setIsLoading(false);
      }
    } catch (error) {
      if (error.name !== "AbortError" && latestRequestRef.current === requestId) {
        console.error("Error fetching data:", error);
        setFilteredData([]);
        setIsFilterApplied(false);
        setIsLoading(false);
      }
    }
  };
  const handleFilterChange = async (selectedStatuses) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
  
    const statusArray = Array.isArray(selectedStatuses) ? selectedStatuses : [selectedStatuses];
    setFilterStatus(statusArray);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setNextPage(1);
    setIsLoading(true);
    try {
      const data = await fetchUserData(1, paginationModel.pageSize, statusArray, fromDate, toDate, filterName, signal);
      setData(data.motorcycle);
      setFilteredData(data);
      setIsFilterApplied(true)
    } catch (error) {
      console.error('Error filtering data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateFilter = async (start, end) => {
    setIsFilterApplied(start !== null && end !== null);
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
    setNextPage(1);
    if (start && end) {
      setIsLoading(true);
      try {
        const formattedStartDate = new Date(start).toLocaleDateString('en-US');
        const formattedEndDate = new Date(end).toLocaleDateString('en-US');
        setFromDate(formattedStartDate);
        setToDate(formattedEndDate);
        const data = await fetchUserData(1, paginationModel.pageSize, filterStatus, formattedStartDate, formattedEndDate, filterName, null);
        setData(data.motorcycle);
        setFilteredData(data)
        setNextPage(1);
        setIsFilterApplied(true);
      } catch (error) {
        console.error('Error filtering data:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      setFromDate(null);
      setToDate(null);
      try {
        const data = await fetchUserData(1, paginationModel.pageSize, filterStatus, null, null, filterName, null);
        setData(data.motorcycle);
        setFilteredData(data);
        setNextPage(1);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getProgressColor = value => {
    if (value < 50) return '#FF4D49'
    if (value <= 70) return 'primary.main'
    return '#309000'
  }

  const totalItems = paginationData?.totalItems ?? 0;
  const currentItems = filteredData?.pagination?.totalItems ?? totalItems;
  const isFiltering = filteredData?.pagination?.totalItems !== undefined && filteredData.pagination.totalItems !== totalItems;
  
  const handleView = (userId) => {
    if (!userId) {
      console.error('Invalid user ID');
      return;
    }
    localStorage.setItem('userId', userId);
    router.replace(`/applications/${userId}`);
  };
  const statusOptions = process.env.NEXT_PUBLIC_DASHBOARD_ALL_STATUSES
    ? JSON.parse(process.env.NEXT_PUBLIC_DASHBOARD_ALL_STATUSES)
    : [];

  const columns = [
    {
      flex: 0.275,
      minWidth: 260,
      field: 'full_name',
      headerName: 'Customer Name',
      renderCell: params => {
        const { row } = params
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>           
            {renderClient({ username: row.userDetails?.fullName,  profileImage: row.userDetails?.profileImage?.length > 0 ? row.profileImage[0]: undefined })}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                {params.row.userDetails?.fullName ? params.row.userDetails.fullName : '-'}
              </Typography>
              <Typography noWrap variant='caption'>
                {/* {row.email} */}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'CONTACT',
      field: 'contact',
      valueGetter: params => new Date(params.value),
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.userDetails?.contactNumber ? params.row.userDetails.contactNumber : '-'}
        </Typography>
      )
    },
    {
      flex: 0.125,
      field: 'salary',
      minWidth: 80,
      headerName: 'BID Price',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          ${params.row.bikeDetails?.reservePrice || '0'}
        </Typography>
      )
    },
    {
      flex: 0.2,
      type: 'date',
      minWidth: 120,
      headerName: 'BID START DATE',
      field: 'start_date',
      valueGetter: params => new Date(params.value),
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.createdAt ? formatDate(params.row.createdAt) : '-'}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'progress',
      headerName: 'PROGRESS',
      renderCell: params => {
        const progressValue = stepProgressMapping[params.row.step] || 0; 
        return (
          <Box sx={{ width: '100%', mr: 1 }}>
            <Typography variant='body2' color='textSecondary' sx={{ fontWeight: '300', color: 'black' }}>
              {progressValue > 0 ? `${progressValue}%` : '0%'}
            </Typography>
            <LinearProgress
              variant='determinate'
              value={progressValue}
              sx={{
                height: 8,
                borderRadius: 5,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getProgressColor(progressValue),
                }
              }}
            />
          </Box>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: 'status',
      headerName: 'Status',
      renderCell: params => {
        const statusKey = userTypeMapping[params.row.status] || null;
        const status = statusKey ? statusObj[statusKey] : { title: `${params.row.status}`, color: 'secondary' };
        const formattedTitle = status.title
          .split(/(?=[A-Z])/)
          .join(' ')
          .replace(/^\w/, (c) => c.toUpperCase());
        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}  
            label={formattedTitle || '-'}  
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'action',
      headerName: 'Action',
      sortable: false,
      renderCell: params => {
        return (
          <button
            onClick={() => handleView(params.row._id)}
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
    <>
      <Card>
        <CardHeader
          title={`All Applications (${isFiltering ? `${currentItems}/${totalItems}` : totalItems})`}
          sx={{ marginBottom: '-4px !important' }}
        />
        <Divider />
        <ApplicationSearch
          value={searchText}
          onChange={event => handleSearch(event.target.value)}
          clearSearch={() => handleSearch('')}
          statusOptions={statusOptions}
          filterStatus={filterStatus}
          onFilterChange={handleFilterChange}
          handleDateFilter={(start, end) => handleDateFilter(start, end)}
          sx={{
            marginBottom: 2,
            padding: '8px 16px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            zIndex: 5
          }}
        />
        <DataGrid
          autoHeight
          columns={columns}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={paginationModel}
          rowCount={currentItems}
          onPaginationModelChange={handlePaginationChange}
          pageSize={paginationModel.pageSize}
          loading={isLoading}
          rows={isLoading ? [] : (data?.length > 0 ? data : (filteredData?.motorcycle || []))}
          localeText={{ noRowsLabel: data?.length === 0 ? 'No data available' : 'Loading...' }}
          rowHeight={data?.length === 0 || isLoading ? 100 : 60}
          getRowId={(row) => row._id}
          slotProps={{
            baseButton: {
              variant: 'outlined'
            },
          }}
          sx={{
            overflow: isLoading ? 'hidden !important' : "auto",
            '& .MuiDataGrid-columnHeaderTitle': {
              color: '#333',
              fontWeight: '600',
              fontSize: '0.9rem'
            }
          }}
        />
      </Card>
    </>
  )
}

export default TableColumns