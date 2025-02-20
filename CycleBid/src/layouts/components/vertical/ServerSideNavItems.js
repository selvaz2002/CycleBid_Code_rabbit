import { useEffect, useState } from 'react'
import axios from 'axios'

const ServerSideNavItems = () => {
  const [menuItems, setMenuItems] = useState([])
  useEffect(() => {
    axios.get('/api/vertical-nav/data').then(response => {
      const menuArray = response.data
      setMenuItems(menuArray)
    })
  }, [])

  return { menuItems }
}

export default ServerSideNavItems
