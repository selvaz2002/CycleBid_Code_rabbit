import Edit from 'src/views/apps/invoice/edit/Edit'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const InvoiceEdit = () => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Edit id='4987' />
    </DatePickerWrapper>
  )
}

export default InvoiceEdit
