import mock from 'src/@fake-db/mock'

const cardStatsData = {
  statsHorizontal: [
    {
      stats: '8,458',
      trend: 'negative',
      trendNumber: '8.1%',
      title: 'New Customers',
      icon: 'mdi:account-outline'
    },
    {
      icon: 'mdi:poll',
      stats: '$28.5k',
      color: 'warning',
      trendNumber: '18.2%',
      title: 'Total Profit'
    },
    {
      color: 'info',
      stats: '2,450k',
      trend: 'negative',
      icon: 'mdi:trending-up',
      trendNumber: '24.6%',
      title: 'New Transactions'
    },
    {
      stats: '$48.2K',
      color: 'success',
      icon: 'mdi:currency-usd',
      trendNumber: '22.5%',
      title: 'Total Revenue'
    }
  ],
  statsVertical: [
    {
      stats: '155k',
      color: 'primary',
      icon: 'mdi:cart-plus',
      trendNumber: '+22%',
      title: 'Total Orders',
      chipText: 'Last 4 Month'
    },
    {
      stats: '$89.34k',
      color: 'warning',
      trend: 'negative',
      trendNumber: '-18%',
      title: 'Total Profit',
      icon: 'mdi:wallet-giftcard',
      chipText: 'Last One Year'
    },
    {
      icon: 'mdi:link',
      color: 'info',
      stats: '142.8k',
      trendNumber: '+62%',
      chipText: 'Last One Year',
      title: 'Total Impression'
    },
    {
      stats: '$13.4k',
      color: 'success',
      trendNumber: '+38%',
      icon: 'mdi:currency-usd',
      title: 'Total Sales',
      chipText: 'Last Six Months'
    },
    {
      color: 'error',
      stats: '$8.16k',
      trend: 'negative',
      trendNumber: '-16%',
      title: 'Total Expenses',
      icon: 'mdi:briefcase-outline',
      chipText: 'Last One Month'
    },
    {
      stats: '$2.55k',
      color: 'secondary',
      icon: 'mdi:trending-up',
      trendNumber: '+46%',
      title: 'Transactions',
      chipText: 'Last One Year'
    }
  ],
  statsCharacter: [
    {
      stats: '4,567',
      trend: 'negative',
      title: 'Auctions',
      chipColor: 'success',
      borderColor: '#7D41FE',
      trendNumber: '-25.5%',
      chipText: 'Total Completed Auctions',
      icon: 'ri:user-add-line',
      src: '/images/cards/card-stats-img-2.png'
    },
    {
      stats: '540',
      title: 'User Growth',
      chipColor: 'primary',
      borderColor: '#4161FE',
      trendNumber: '+15.6%',
      chipText: 'Total Users',
      icon: 'ri:group-line',
      src: '/images/cards/card-stats-img-1.png'
    },

    {
      stats: '$32M',
      title: 'Active Users',
      chipColor: 'warning',
      borderColor: '#23C333',
      trendNumber: '+9.2%',
      chipText: 'Last week analytics',
      icon: 'ri:user-follow-line',
      src: '/images/cards/card-stats-img-3.png'
    }
  ],
  statsLogo: [
    {
      stats: '21,459',
      title: 'Active Users',
      chipColor: 'primary',
      borderColor: '#4161FE',
      trendNumber: '+15.6%',
      chipText: 'Total Users',
      icon: 'ri:group-line'
    },
    {
      stats: '120',
      trend: 'negative',
      title: 'Blocked Users',
      chipColor: 'success',
      borderColor: '#FE4183',
      trendNumber: '-25.5%',
      chipText: 'Blocked / Ban Users for Violations',
      icon: 'ri:user-add-line'
    },
    {
      stats: '19,860',
      title: 'Active Users',
      chipColor: 'warning',
      borderColor: '#23C333',
      trendNumber: '+9.2%',
      chipText: 'Last week analytics',
      icon: 'ri:user-follow-line'
    },
    {
      stats: '1M',
      trendNumber: '+10.8%',
      chipColor: 'secondary',
      borderColor: '#FEA059',
      title: 'Sales',
      chipText: 'Sales Growth',
      icon: 'ri:user-search-line'
    }
  ],
  AllUsersLogo: [
    {
      stats: '250',
      title: 'Active Users',
      chipColor: 'primary',
      borderColor: '#4161FE',
      trendNumber: '+15.6%',
      chipText: 'Total Users',
      icon: 'ri:group-line'
    },
    {
      stats: '30',
      trend: 'negative',
      title: 'Inactive Users',
      chipColor: 'success',
      borderColor: '#4161FE',
      trendNumber: '-25.5%',
      chipText: 'Blocked / Ban Users for Violations',
      icon: 'ri:group-line'
    },
    {
      stats: '12',
      title: 'Deleted Users',
      chipColor: 'warning',
      borderColor: '#FE4183',
      trendNumber: '+9.2%',
      chipText: 'Deleted Users from Auction list',
      icon: 'ri:user-add-line'
    },
    {
      stats: '1M',
      trendNumber: '+10.8%',
      chipColor: 'secondary',
      borderColor: '#FEA059',
      title: 'Sales',
      chipText: 'Sales Growth',
      icon: 'ri:user-search-line'
    }
  ],
  UserViewDashboard: [
    {
      stats: '$34,000',
      title: 'Auction BID',
      chipColor: 'primary',
      borderColor: '#4161FE',
      trendNumber: '+15.6%',
      chipText: 'Total Users',
      icon: 'ri:group-line'
    },
    {
      stats: '2',
      trend: 'negative',
      title: 'Sell Vehicles ',
      chipColor: 'success',
      borderColor: '#8641FE',
      trendNumber: '-25.5%',
      chipText: 'Blocked / Ban Users for Violations',
      icon: 'ri:group-line'
    },
    {
      stats: '3',
      title: 'Buy Vehicles',
      chipColor: 'warning',
      borderColor: '#FE41CF',
      trendNumber: '+9.2%',
      chipText: 'Deleted Users from Auction list',
      icon: 'ri:group-line'
    }
  ],
  auctionData: [
    {
      stats: '230',
      title: 'Ongoing',
      chipColor: 'primary',
      borderColor: '#4161FE',
      trendNumber: '+15.6%',
      chipText: 'Total Ongoing Auctions',
      icon: 'ri:group-line',
      src: '/images/cards/card-stats-img-1.png'
    },
    {
      stats: '20',
      trend: 'negative',
      title: 'Past/Sold Auctions',
      chipColor: 'success',
      borderColor: '#7D41FE',
      trendNumber: '-25.5%',
      chipText: 'Sold Auctions',
      icon: 'ri:user-add-line',
      src: '/images/cards/card-stats-img-2.png'
    },
    {
      stats: '15',
      title: 'Rejected Auctions',
      chipColor: 'error',
      borderColor: '#ff4d49',
      trendNumber: '+9.2%',
      chipText: 'Total Rejected Auctions',
      icon: 'ri:user-follow-line',
      src: '/images/cards/card-stats-img-3.png'
    }
  ]
}
mock.onGet('/cards/statistics').reply(() => {
  return [200, cardStatsData]
})