import axios from 'axios'
import UserView from 'src/pages/users/userview/[mail]'

const UserViewMain = ({ tab, invoiceData }) => {
  return (
    <UserView tab={tab}/>
  )
}
export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'overview' } },
      { params: { tab: 'security' } },
      { params: { tab: 'card-details' } },
      { params: { tab: 'notification' } },
      { params: { tab: 'messages' } }
    ],
    fallback: false
  }
}
export const getStaticProps = async ({ params }) => {
  const res = await axios.get('/apps/invoice/invoices')
  const invoiceData = res.data.allData
  return {
    props: {
      invoiceData,
      tab: params?.tab
    }
  }
}

export default UserViewMain
