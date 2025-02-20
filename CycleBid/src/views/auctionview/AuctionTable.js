import { useState } from 'react'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import TableSold from './AuctionSoldDataTable'
import TableReject from 'src/views/auctionview/AuctionRejectDataTable'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import AuctionDataTable from './AuctionDataTable'

const TabList = styled(MuiTabList)(() => ({
  '& .tabStyle': {
    textTransform: 'none',
    fontSize: '16px',
    marginBottom: 3
  }
}))

const AuctionTable = ({ tableData }) => {
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList variant='scrollable' onChange={handleChange} aria-label='Tab' sx={{ marginTop: 1 }}>
        <Tab value='1' className='tabStyle' label='Current Auctions' />
        <Tab value='2' className='tabStyle' label='Sold Auctions' />
        <Tab value='3' className='tabStyle' label='Rejected Auctions' />
      </TabList>
      <TabPanel value='1' sx={{ padding: 0 }}>
        <AuctionDataTable tableData={tableData.auctionData} />
      </TabPanel>
      <TabPanel value='2' sx={{ padding: 0 }}>
        <TableSold tableData={tableData.auctionSoldData} />
      </TabPanel>
      <TabPanel value='3' sx={{ padding: 0 }}>
        <TableReject tableData={tableData.auctionRejectData} />
      </TabPanel>
    </TabContext>
  )
}

export default AuctionTable
