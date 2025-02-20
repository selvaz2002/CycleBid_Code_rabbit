import { Fragment, useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import FAQS from 'src/views/pages/faq/Faqs'
import FaqHeader from 'src/views/pages/faq/FaqHeader'
import FaqFooter from 'src/views/pages/faq/FaqFooter'

const FAQ = ({ apiData }) => {
  const [data, setData] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('payment')
  useEffect(() => {
    if (searchTerm !== '') {
      axios.get('/pages/faqs', { params: { q: searchTerm } }).then(response => {
        if (response.data.faqData && Object.values(response.data.faqData).length) {
          setData(response.data)
          setActiveTab(Object.values(response.data.faqData)[0].id)
        } else {
          setData(null)
        }
      })
    } else {
      setData(apiData)
    }
  }, [apiData, searchTerm])
  const handleChange = (event, newValue) => {
    setActiveTab(newValue)
  }
  const renderNoResult = (
    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', '& svg': { mr: 2 } }}>
      <Icon icon='mdi:alert-circle-outline' />
      <Typography variant='h6'>No Results Found!!</Typography>
    </Box>
  )
  return (
    <Fragment>
      <FaqHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {data !== null ? <FAQS data={data} activeTab={activeTab} handleChange={handleChange} /> : renderNoResult}
      <FaqFooter />
    </Fragment>
  )
}
export const getStaticProps = async () => {
  const res = await axios.get('/pages/faqs')
  const apiData = res.data
  return {
    props: {
      apiData
    }
  }
}

export default FAQ
