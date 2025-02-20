const navigation = () => {
  return [
    {
      title:"Dashboard",
      icon: 'material-symbols:space-dashboard-outline',
      path:"/dashboard",
      selectedIcon:'material-symbols:space-dashboard-rounded'
    },
    {
      title:"Auctions",
      icon: 'material-symbols:bid-landscape-outline',
      path:"/auctions",
      selectedIcon:'material-symbols:bid-landscape'

    },
    {
      title: 'User Management',
      icon: 'material-symbols:person-outline',
      path: '/users',
      selectedIcon:'material-symbols:person'
    },
    {
      title:"Staff Access",
      icon: 'material-symbols:drafts-outline',
    },
    {
      title:"Settings",
      icon: 'material-symbols:settings-outline',

    },
  ]
}

export default navigation


