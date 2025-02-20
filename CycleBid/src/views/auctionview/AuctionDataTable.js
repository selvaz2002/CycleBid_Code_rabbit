import { useState, useRef } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Avatar } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { useRouter } from 'next/router'
import LightTooltip from '../components/tooltip/CustomizedTooltip'
import { getRemainingTime, formatDay, formatDate } from 'src/@core/utils/getRemainingTime'

import Spinner from 'src/@core/components/spinner'
import AuctionSearchToolbar from './AuctionSearchToolbar'
import axiosInstanceNew from 'src/axiosInstanceNew'
import { renderClient } from 'src/@core/utils/auctionUtils'

const fetchUserData = async (page, pageSize, status, fromDate, toDate, searchValue, signal) => {
  try {
    let url = `/get-auctions?page=${page}&limit=${pageSize}`

    if (status) url += `&sortBy=${status}`
    if (fromDate && toDate) {
      url += `&fromDate=${fromDate}&toDate=${toDate}`
    } else if (fromDate) {
      url += `&fromDate=${fromDate}`
    } else if (toDate) {
      url += `&toDate=${toDate}`
    }
    if (searchValue) url += `&search=${encodeURIComponent(searchValue)}`
    url += `&sortBy=newlyAdded`

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }

    if (signal) {
      config.signal = signal
    }

    const response = await axiosInstanceNew.get(url, config)

    if (response.status === 'error') {
      return { data: [] }
    }

    return response
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('API aborted:', error)
      return { data: [] }
    }
    console.error('Error fetching data:', error)
    return { data: [] }
  }
}

const AuctionDataTable = ({ tableData }) => {
  const [data, setData] = useState(tableData?.data || [])
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState('')
  const [filterName, setFilterName] = useState('')
  const [fromDate, setFromDate] = useState(null)
  const loadingRef = useRef({})
  const abortControllerRef = useRef(null)
  const latestRequestRef = useRef(0)
  const [activeBid, setActiveBid] = useState(null)
  const [bidDataMap, setBidDataMap] = useState({})
  const [toDate, setToDate] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [nextPage, setNextPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async (nextPage, pageSize, filterStatus, fromDate, toDate, filterName, signal) => {
    if (nextPage) {
      setIsLoading(true)

      try {
        const data = await fetchUserData(nextPage, pageSize, filterStatus, fromDate, toDate, filterName, signal)
        setData(prevData => {
          const updatedData = [...prevData]
          const startIdx = (nextPage - 1) * paginationModel.pageSize
          if (Array.isArray(data.data)) {
            updatedData.splice(startIdx, data.data.length, ...data.data)
          } else {
            console.error('data.data is not an array:', data)
          }
          return updatedData
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const fetchInitialData = async pageSize => {
    setIsLoading(true)
    try {
      const data = await fetchUserData(1, pageSize, filterStatus, fromDate, toDate, filterName, null)
      setData(data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaginationChange = newPaginationModel => {
    setPaginationModel(newPaginationModel)
    const { page, pageSize } = newPaginationModel
    if (pageSize !== paginationModel.pageSize) {
      setIsLoading(true)
      setPaginationModel({ page: 0, pageSize })
      setNextPage(1)
      setData([])
      fetchInitialData(pageSize)
    } else if (page > paginationModel.page) {
      const updatePage = nextPage + 1
      fetchData(updatePage, paginationModel.pageSize, filterStatus, fromDate, toDate, filterName, null)
      setNextPage(updatePage)
    } else if (page < paginationModel.page) {
      setIsLoading(true)
      const updatePage = nextPage - 1

      setData(data)
      setNextPage(updatePage)
      setIsLoading(false)
    }
  }

  const handleSearch = async searchValue => {
    setSearchText(searchValue)
    setFilterName(searchValue)
    setPaginationModel(prev => ({ ...prev, page: 0 }))
    setNextPage(1)
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    const requestId = Date.now()
    latestRequestRef.current = requestId
    setIsLoading(true)

    try {
      const response = await fetchUserData(
        1,
        paginationModel.pageSize,
        filterStatus,
        fromDate,
        toDate,
        searchValue || '',
        signal
      )

      if (latestRequestRef.current === requestId) {
        setData(response.data)
        setFilteredData(response)
      }
    } catch (error) {
      if (error.name !== 'AbortError' && latestRequestRef.current === requestId) {
        setData([])
        setFilteredData([])
      }
    } finally {
      if (latestRequestRef.current === requestId) {
        setIsLoading(false)
      }
    }
  }
  const totalItems = tableData?.pagination?.totalItems ?? 0
  const currentItems = filteredData?.pagination?.totalItems ?? totalItems
  const isFiltering =
    filteredData?.pagination?.totalItems !== undefined && filteredData.pagination.totalItems !== totalItems

  const fetchBidData = async id => {
    try {
      loadingRef.current[id] = true
      const data = await axiosInstanceNew.get(`/get-biddings?auctionId=${id}`)
      setBidDataMap(prevData => ({
        ...prevData,
        [id]: data.data
      }))
    } catch (error) {
      console.error('Error fetching bid data:', error)
    } finally {
      loadingRef.current[id] = false
    }
  }

  const handleApply = async selectedStatuses => {
    const newSortBy =
      selectedStatuses[0] === 'Highest - Low Bid'
        ? 'highestBid'
        : selectedStatuses[0] === 'Low - Highest Bid'
        ? 'lowerBid'
        : ''

    setFilterStatus(newSortBy)
    setPaginationModel(prev => ({ ...prev, page: 0 }))
    setNextPage(1)
    setIsLoading(true)

    try {
      const data = await fetchUserData(1, paginationModel.pageSize, newSortBy, fromDate, toDate, filterName, null)
      setData(data.data)
      setFilteredData(data)
    } catch (error) {
      console.error('Error filtering data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateFilter = async (start, end) => {
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize })
    setNextPage(1)
    setIsLoading(true)

    try {
      const formattedStartDate = start ? new Date(start).toLocaleDateString('en-US') : null
      const formattedEndDate = end ? new Date(end).toLocaleDateString('en-US') : null

      setFromDate(formattedStartDate)
      setToDate(formattedEndDate)

      const data = await fetchUserData(
        1,
        paginationModel.pageSize,
        filterStatus,
        formattedStartDate,
        formattedEndDate,
        filterName,
        null
      )

      setData(data.data)
      setFilteredData(data)
      setNextPage(1)
    } catch (error) {
      console.error('Error filtering data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTooltipOpen = rowId => {
    setActiveBid(rowId)
    if (!bidDataMap[rowId] && !loadingRef.current[rowId]) {
      fetchBidData(rowId)
    }
  }

  const handleTooltipClose = () => {
    setActiveBid(null)
  }

  const columns = [
    {
      flex: 0.275,
      minWidth: 200,
      field: 'vehicle',
      headerName: 'Bike Name',
      renderCell: params => {
        const { row } = params
        const year = row.motorcycleDetails?.bikeDetails?.year ?? '-'
        const model = row.motorcycleDetails?.bikeDetails?.model ?? '-'
        const make = row.motorcycleDetails?.bikeDetails?.make ?? '-'

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '100%' }}>
            {renderClient({
              username: row.userFullName,
              profileImage:
                row.motorcycleDetails.pictures.length > 0 ? row.motorcycleDetails.pictures[0].url : undefined
            })}
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, maxWidth: '100%' }}>
              <Typography
                variant='body2'
                sx={{ color: 'text.primary', fontWeight: 600, whiteSpace: 'normal', wordBreak: 'break-word' }}
              >
                {`${year} ${model}`}
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  color: 'text.primary',
                  paddingTop: 1,
                  fontWeight: 600,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word'
                }}
              >
                {make}
              </Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.275,
      minWidth: 200,
      field: 'full_name',
      headerName: 'Seller',
      renderCell: params => {
        const { row } = params
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, maxWidth: '100%' }}>
              <Typography
                noWrap
                variant='body2'
                sx={{ color: 'text.primary', fontWeight: 600, whiteSpace: 'normal', wordBreak: 'break-word' }}
              >
                {row.userInfo?.username ?? '-'}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      type: 'date',
      minWidth: 120,
      headerName: 'Bid Start Date',
      field: 'start_date',
      valueGetter: params => new Date(params.value),
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatDate(params.row.motorcycleDetails?.createdAt ?? '-')}
        </Typography>
      )
    },

    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Bid End In',
      renderCell: params => {
        const { label, color } = getRemainingTime(params.row.bidEndingOn ?? '-')
        return (
          <CustomChip
            size='small'
            skin='light'
            color={color}
            label={label}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },

    {
      flex: 0.125,
      field: 'salary',
      minWidth: 80,
      headerName: 'BID Price',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          ${params.row?.bidPrice ?? 0}
        </Typography>
      )
    },
    {
      flex: 0.125,
      field: 'age',
      minWidth: 80,
      headerName: 'BID',
      renderCell: params => {
        const bidData = bidDataMap[params.row._id]
        return !params.row.bidsCount || params.row.bidsCount == 0 ? (
          <Typography
            variant='body2'
            sx={{
              color: 'text.primary'
            }}
          >
            {params.row.bidsCount ?? 0}
          </Typography>
        ) : (
          <LightTooltip
            onOpen={() => handleTooltipOpen(params.row._id)}
            onClose={() => handleTooltipClose()}
            title={
              <Box
                sx={{
                  pt: 4,
                  pb: 3,
                  background: '#fff',
                  minHeight: 200,
                  borderRadius: '12px',
                  position: 'relative'
                }}
              >
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: '600',
                    mr: 5,
                    ml: 2,
                    fontSize: '18px',
                    lineHeight: '24px',
                    color: '#152639',
                    pb: 3,
                    borderBottom: '1px solid #B9BEC499',
                    width: '100% !important'
                  }}
                >
                  Bid List ({params.row.bidsCount})
                </Typography>

                {!bidData ? (
                  <Box
                    sx={{
                      pt: 4,
                      pb: 3,
                      background: '#fff',
                      borderRadius: '12px',
                      height: 'auto',
                      maxHeight: '200px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Spinner />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      maxHeight: '400px',
                      overflowY: 'auto',
                      pt: 3,
                      '&::-webkit-scrollbar': {
                        width: '8px',
                        backgroundColor: '#DFE2E6'
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#1E70EB',
                        borderRadius: '4px'
                      }
                    }}
                  >
                    {bidData?.allBids?.map((status, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          mb: 3,
                          ml: 4,
                          pt: index === 0 ? 0 : 2,
                          borderBottom: '1px solid',
                          borderBottomColor: '#B9BEC499',
                          justifyContent: 'center',

                          ':last-child': { borderBottom: 'none', mb: 0 }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                          <Avatar
                            src={status.userDetails?.profileImage}
                            alt='Name'
                            sx={{ width: 40, height: 40, ml: 1, mt: 2 }}
                          />
                        </Box>

                        <Box sx={{ flexGrow: 2, display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3, ml: 5 }}>
                          <Typography variant='body2' sx={{ fontWeight: '600', color: 'black', fontSize: '15px' }}>
                            {status.userDetails?.username ?? '-'}
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{ color: 'Black', fontWeight: '700', lineHeight: '20px', fontSize: '16px' }}
                          >
                            Bid: ${status.bidPrice}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'center',
                            alignContent: 'center',
                            alignItems: 'flex-end',
                            gap: 2.5,
                            mr: 5
                          }}
                        >
                          <Typography variant='caption' sx={{ color: '#5B6774', mt: 0.5 }}>
                            {formatDay(status.auctionDetails?.bidEndingOn)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 3,
                    borderTop: '1px solid',
                    borderTopColor: 'divider',
                    pt: 4
                  }}
                >
                  <Button
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      display: 'flex',
                      border: '1px solid',
                      padding: '5px 20px'
                    }}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            }
            placement='bottom-end'
            PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [80, -5]
                  }
                },
                {
                  name: 'flip',
                  enabled: false
                },
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: 'viewport'
                  }
                }
              ]
            }}
            sx={{
              zIndex: 99
            }}
          >
            <Typography
              variant='body2'
              sx={{
                color: activeBid === params.row._id ? 'blue' : 'text.primary',
                cursor: 'pointer',
                ':hover': {
                  color: 'blue'
                }
              }}
            >
              {params.row.bidsCount}
            </Typography>
          </LightTooltip>
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
        const handleRowClick = userId => {
          router.push(`/auctions/${userId}`)
        }
        return (
          <button
            onClick={() => handleRowClick(params.row._id)}
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
        title={`Auctions (${isFiltering ? `${currentItems}/${totalItems}` : totalItems})`}
        action={
          <>
            <AuctionSearchToolbar
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              clearSearch={() => handleSearch('')}
              handleDateFilter={handleDateFilter}
              handleApply={handleApply}
            />
          </>
        }
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          justifyItems: 'center',
          alignContent: 'center',
          '& .MuiCardHeader-action': {
            alignSelf: 'center'
          }
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
        rows={isLoading ? [] : data?.length > 0 ? data : filteredData?.data || []}
        localeText={{ noRowsLabel: data?.length === 0 ? 'No data available' : 'Loading...' }}
        rowHeight={data?.length === 0 || isLoading ? 100 : 100}
        getRowId={row => row._id}
        slotProps={{
          baseButton: {
            variant: 'outlined'
          }
        }}
        sx={{
          overflow: isLoading ? 'hidden !important' : 'auto',
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

export default AuctionDataTable
