import { useState } from 'react'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import TableFilter from 'src/views/table/data-grid/AuctionDataTable'
import TableSold from 'src/views/table/data-grid/AuctionSoldDataTable'
import TableReject from 'src/views/table/data-grid/AuctionRejectDataTable'

import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'

const TabList = styled(MuiTabList)(({ theme }) => ({
  '& .tabStyle': {
    textTransform: 'none',
    fontSize: '16px',
    marginBottom:3
  },
}))

const TabsSimple = ({tableData}) => {
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
    if (newValue === '1') {
      localStorage.setItem('activeTab', 'current')
    } else if (newValue === '2') {
      localStorage.setItem('activeTab', 'sold')
    } else if (newValue === '3') {
      localStorage.setItem('activeTab', 'rejected')
    }
  }
  const handleRowClick = (activeTab) => {
        localStorage.setItem('activeTab', activeTab);
  };

  return (
    <TabContext value={value}>
      <TabList variant="scrollable" onChange={handleChange} aria-label='Tab'  sx={{marginTop:1}}>
        <Tab value='1' className='tabStyle' label='Current Auctions' />
        <Tab value='2' className='tabStyle' label='Sold Auctions' />
        <Tab value='3' className='tabStyle' label='Rejected Auctions'/>
      </TabList>
      <TabPanel value='1' sx={{ padding:0 }}>
        <TableFilter tableData={tableData.auctionData} activeTab="current" handleRowClick={handleRowClick} />
      </TabPanel>
      <TabPanel value='2' sx={{ padding:0 }}>
      <TableSold tableData={tableData.auctionSoldData} activeTab="sold" />
      </TabPanel>
      <TabPanel value='3' sx={{ padding:0 }}>
      <TableReject tableData={tableData.auctionRejectData} activeTab="rejected" />
      </TabPanel>
    </TabContext>
  )
}

export default TabsSimple




