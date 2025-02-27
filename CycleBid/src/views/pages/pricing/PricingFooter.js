import { useState } from 'react'

import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordion from '@mui/material/Accordion'

import Icon from 'src/@core/components/icon'

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  '&:before': { display: 'none' },
  boxShadow: `${theme.shadows[0]} !important`,
  borderLeft: `1px solid ${theme.palette.divider}`,
  borderRight: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:first-of-type': { borderTop: `1px solid ${theme.palette.divider}` },
  '&.Mui-expanded + .MuiAccordion-root': { borderTop: `1px solid ${theme.palette.divider}` }
}))

const PricingFooter = props => {
  const { data } = props

  const [expanded, setExpanded] = useState(false)

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const renderAccordion = () => {
    return data?.faq.map(item => {
      return (
        <Accordion key={item.id} elevation={0} expanded={expanded === item.id} onChange={handleChange(item.id)}>
          <AccordionSummary
            id={`pricing-accordion-${item.id}-header`}
            expandIcon={<Icon icon='mdi:chevron-down' />}
            aria-controls={`pricing-accordion-${item.id}-content`}
          >
            <Typography>{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      )
    })
  }

  return (
    <>
      <Box sx={{ mb: 11.75, textAlign: 'center' }}>
        <Typography variant='h5' sx={{ mb: 2.5 }}>
          FAQs
        </Typography>
        <Typography variant='body2'>Let us help answer the most common questions.</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <div>{renderAccordion()}</div>
      </Box>
    </>
  )
}

export default PricingFooter
