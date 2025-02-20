import { useState } from 'react'
import { Card, styled } from '@mui/material'
import MuiCardContent from '@mui/material/CardContent'
import axios from 'axios'
import PricingCTA from 'src/views/pages/pricing/PricingCTA'
import PricingTable from 'src/views/pages/pricing/PricingTable'
import PricingPlans from 'src/views/pages/pricing/PricingPlans'
import PricingHeader from 'src/views/pages/pricing/PricingHeader'
import PricingFooter from 'src/views/pages/pricing/PricingFooter'

const CardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: `${theme.spacing(20, 36)} !important`,
  [theme.breakpoints.down('xl')]: {
    padding: `${theme.spacing(20)} !important`
  },
  [theme.breakpoints.down('sm')]: {
    padding: `${theme.spacing(10, 5)} !important`
  }
}))
const Pricing = ({ apiData }) => {
  const [plan, setPlan] = useState('annually')
  const handleChange = e => {
    if (e.target.checked) {
      setPlan('annually')
    } else {
      setPlan('monthly')
    }
  }
  return (
    <Card>
      <CardContent>
        <PricingHeader plan={plan} handleChange={handleChange} />
        <PricingPlans plan={plan} data={apiData.pricingPlans} />
      </CardContent>
      <PricingCTA />
      <CardContent>
        <PricingTable data={apiData} />
      </CardContent>
      <CardContent sx={{ backgroundColor: 'action.hover' }}>
        <PricingFooter data={apiData} />
      </CardContent>
    </Card>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/pages/pricing')
  const apiData = res.data
  return {
    props: {
      apiData
    }
  }
}

export default Pricing
