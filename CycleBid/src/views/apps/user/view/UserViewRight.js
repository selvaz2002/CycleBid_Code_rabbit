import { useState, useEffect } from 'react'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import UserViewBilling from 'src/views/users/UserViewBilling'
import UserViewSecurity from 'src/views/users/UserViewSecurity'
import UserViewConnection from 'src/views/apps/user/view/UserViewConnection'
import UserViewNotification from 'src/views/apps/user/view/UserViewNotification'



const UserViewRight = ({ tab, invoiceData }) => {

  const [activeTab, setActiveTab] = useState(tab)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [tab])
  useEffect(() => {
    if (invoiceData) {
      setIsLoading(false)
    }
  }, [invoiceData])

  return (
    <TabContext value={activeTab}>
            <TabPanel sx={{ p: 0 }} value='security'>
            <UserViewSecurity />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='billing-plan'>
              <UserViewBilling />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='notification'>
              <UserViewNotification />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='connection'>
              <UserViewConnection />
            </TabPanel>
    </TabContext>
  )
}

export default UserViewRight
