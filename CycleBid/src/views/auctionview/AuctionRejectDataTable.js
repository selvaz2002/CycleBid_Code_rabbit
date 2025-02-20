
import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import { Divider, Button } from '@mui/material'
import { styled } from '@mui/system';
import { tooltipClasses } from '@mui/material/Tooltip';


import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import AuctionSearchToolbar from './AuctionSearchToolbar'
import { useRouter } from 'next/router'


import { getInitials } from 'src/@core/utils/get-initials'
import { format } from 'date-fns'
import axiosInstance from 'src/axiosInstance'


const renderClient = params => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  if (row.avatar) {
    return (
      <CustomAvatar
        src={`${row.avatar}`}
        sx={{
          mr: 3,
          width: '4rem',
          height: '4rem',
          borderRadius: '8px'
        }}
      />
    )
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={color}
        sx={{
          mr: 3,
          fontSize: '.8rem',
          width: '4rem',
          height: '4rem',
          borderRadius: '8px'
        }}
      >
        {getInitials(row.full_name ? row.full_name : 'A').slice(0, 2)}
      </CustomAvatar>
    )
  }
}


const statusObj = (status) => {
  const states = [undefined, undefined, 'error']
  const color = states[status]
  return color;
}

const escapeRegExp = value => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const TableColumns = ({ tableData,activeTab }) => {
 s
  const [data] = useState(tableData)
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const router = useRouter()
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const [activeBid, setActiveBid] = useState(null)
  const [bidDataMap, setBidDataMap] = useState({});

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')

    const filteredRows = data.filter(row => {
      return searchRegex.test(row.motorcycleDetails.bikeDetails?.make?.toString() || "");
    });

    if (searchValue.length) {
      setFilteredData(filteredRows)
      setIsFilterApplied(true)
    } else {
      setFilteredData([])
      setIsFilterApplied(false)
    }
  }

  useEffect(() => {
    data.forEach(row => {
      if (!bidDataMap[row._id]) {
        fetchBidData(row._id);
      }
    });
  }, [data, bidDataMap]);

  const fetchBidData = async (id) => {
    try {
      console.log(".............")
      const data = await axiosInstance.get(`/get-biddings?auctionId=${id}`);
      console.log(data.data)
      setBidDataMap((prevData) => ({
        ...prevData,
        [id]: data.data,
      }));
    } catch (error) {
      console.error('Error fetching bid data:', error);
    } finally {
    }
  };

  const handleApply = (selectedStatuses) => {
    let sortedData = [...data];

    if (selectedStatuses.includes('Highest - Low Bid')) {
      sortedData.sort((a, b) => b.bidPrice - a.bidPrice);
    } else if (selectedStatuses.includes('Low - Highest Bid')) {
      sortedData.sort((a, b) => a.bidPrice - b.bidPrice);
    }
    setFilteredData(sortedData);
  }

  const handleDateFilter =  async (start, end) => {


    setIsLoading(true)

    try{

    if (start && end) {
      const filteredData = await axiosInstance.get(`/get-auctions?sortBy=newlyAdded&fromDate=${start}&toDate=${end}`)
      console.log("filterdata,start,end",filteredData.status,start,end)

      setFilteredData(filteredData.data);
      setIsFilterApplied(true)
      if(filteredData.status == 'error'){
        setFilteredData([])
        setIsFilterApplied(true)
      }
    }
    else {
      setFilteredData([]);
      setIsFilterApplied(false)
    }
  }catch(err){
       console.log(err)
       setFilteredData([])
       setIsFilterApplied(false)
  }
  finally{
    setIsLoading(false)
  }
  }



  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {

      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.3)',
      fontSize: 11,
      minWidth: '426px',
      maxWidth: '300px',
      borderRadius: "20px",
      minHeight: "200px",
      position: "relative",



    },
    [`& .${tooltipClasses.tooltip}::before`]: {
      content: '""',
      position: 'absolute',
      top: '-15px',
      left: '80%',
      transform: 'translateX(-50%)',
      width: '40px',
      height: '20px',
      backgroundColor: '#FFF',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      boxShadow: '1px 1px 12px rgba(0, 0, 0, 0.7) !important',


    },


  }));

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatDateMin = (dateStr) => {
    const date = new Date(dateStr);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const formatDay = (dateString) => {
  const date = new Date(dateString);

  const options = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  return `${formattedDate}`;
};
  const columns = [
    {
      flex: 0.275,
      minWidth: 200,
      field: 'vehicle',
      headerName: 'Bike Name',
      renderCell: params => {
        const { row } = params
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {`${row.motorcycleDetails.bikeDetails?.year} ${row.motorcycleDetails.bikeDetails?.model}` ?? '-'}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', paddingTop: 1, fontWeight: 600 }}>
              {row.motorcycleDetails.bikeDetails?.make}
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.motorcycleDetails.userDetails.fullName}
              </Typography>
              <Typography noWrap variant='caption' sx={{ paddingTop: 1 }}>
              {row.motorcycleDetails.userDetails.email ?? '-'}
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
          {formatDate(params.row.motorcycleDetails.createdAt)}
        </Typography>
      )
    },

    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Bid End In',
      renderCell: params => {
        const color = params.row.status.toLowerCase() == 'open' ? 'error' :'secondary';
        return (
          <CustomChip
            size='small'
            skin='light'
            color={color}
            label={formatDateMin(params.row.bidEndingOn)}
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
          ${params.row.bidPrice }
        </Typography>
      )
    },
    {
      flex: 0.125,
      field: 'age',
      minWidth: 80,
      headerName: 'BID',
      renderCell: (params) => {
        const bidData = bidDataMap[params.row._id] ?? {totalBidsCount:'-'};
        return (
          bidData.totalBidsCount == 0 ?
          <Typography variant="body2" sx={{
            color: "text.primary",
          }}>
            {bidData.totalBidsCount}
          </Typography>
          :
          <LightTooltip
            onOpen={() => setActiveBid(params.row._id)}
            onClose={() => setActiveBid(null)}

            title={
              <Box
                sx={{
                  pt: 4,
                  pb: 3,
                  background: '#fff',
                  minHeight: 200,
                  borderRadius: '12px',
                  position: 'relative',
                }}
              >
                <Typography variant="h6" sx={{
                  fontWeight: '600',
                  mr: 5,
                  ml: 2, fontSize: "18px",
                  lineHeight: "24px",
                  color: "#152639",
                  pb: 3,
                  borderBottom: "1px solid #B9BEC499",
                  width: "100% !important"
                }}>
                  Bid List ({bidData.totalBidsCount})
                </Typography>

                <Box
                  sx={{
                    maxHeight: "400px",
                    overflowY: 'auto',

                    pt: 3,


                    '&::-webkit-scrollbar': {
                      width: '8px',
                      backgroundColor: "#DFE2E6"
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#1E70EB',
                      borderRadius: '4px',
                    },
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
                        justifyContent: "center",

                        ':last-child': { borderBottom: 'none', mb: 0 },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                        <Avatar src={status.userDetails.profileImage} alt="Name" sx={{ width: 40, height: 40, ml: 1, mt: 2 }} />
                      </Box>

                      <Box sx={{ flexGrow: 2, display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3, ml: 5 }}>
                        <Typography variant="body2" sx={{ fontWeight: '600', color: "black", fontSize: "15px" }}>
                          {status.userDetails.username}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'Black', fontWeight: "700", lineHeight: "20px", fontSize: "16px" }}>
                          Bid: ${status.bidPrice}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", alignContent: "center", alignItems: "flex-end", gap: 2.5, mr: 5 }}>

                        <Typography variant="caption" sx={{ color: '#5B6774', mt: 0.5 }}>
                          {formatDay(status.auctionDetails.bidEndingOn)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

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

                    sx={{ borderRadius: '8px', textTransform: 'none', display: "flex", border: "1px solid", padding: "5px 20px" }}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            }
            placement="bottom-end"
            PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [80, -5],
                  },
                },
                {
                  name: 'flip',
                  enabled: false,
                },
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: 'viewport',
                  },
                }
              ],
            }}
            sx={{
              zIndex: 1,
            }}

          >
            <Typography variant="body2" sx={{
              color: activeBid === params.row._id ? "blue" : "text.primary",
              cursor: 'pointer',
              ':hover': {
                color: "blue"
              }
            }}>
              {bidData.totalBidsCount}
            </Typography>
          </LightTooltip>

        );
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'action',
      headerName: 'Actions',
      sortable: false,
      renderCell: params => {
        const handleRowClick = (userId, activeTab) => {
          localStorage.setItem('activeTab', activeTab);
          router.push(`/auctions/${userId}`);
        }

        return (
          <button
          onClick={() => handleRowClick(params.row._id,activeTab)}
            style={{
              padding: '4px 8px',
              backgroundColor: 'transparent',
              color: 'text.primary',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Typography variant='body2' sx={{ color: 'primary.main', fontWeight: 'bold' }}>View</Typography>
          </button>
        );
      }
    }
  ]

  return (
    <Card>
      <CardHeader title={`Auctions (${data.length})`}
        action={
          <>
            <AuctionSearchToolbar
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              clearSearch={() => handleSearch('')}
              handleDateFilter={handleDateFilter}
              handleApply={handleApply}>
            </AuctionSearchToolbar>
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
        getRowId={(row) => row._id}
        onPaginationModelChange={setPaginationModel}
        rows={(filteredData.length || isFilterApplied) ? filteredData : data}
        rowHeight={100}
        localeText={{ noRowsLabel: "No data available" }}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            color: '#333',
            fontWeight: '600',
            fontSize: '0.9rem',

          },
        }}
      />
    </Card>
  )
}

export default TableColumns



