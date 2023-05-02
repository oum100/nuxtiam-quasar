export default [
    {
      title: "Dashboard",
      to:"/backend/dashboard",
      icon:"dashboard",
      separator: false
    },
    {
      title: "Transaction",
      to:"/backend/dashboard/transaction",
      icon:"mdi-list-box-outline",
      separator:false,
    },  
    {
      title: "Asset",
      to: "/backend/dashboard/asset",
      icon:"memory",
      separator:false,
    },
    {
      title: "Device",
      to: "/backend/dashboard/device",
      icon:"mdi-remote-tv",
      separator:false,
    },
    {
      title: "MQTT",
      to: "/backend/dashboard/mqtt",
      icon:"mdi-quality-medium",
      separator:false,
    },
    {
      header:"/Branch",
      icon:"mdi-storefront-outline",
      title: "Branch",
      children:[
        {
          title:"Branch",
          icon:"mdi-storefront-outline",
          to:"/backend/branch/branch",
          separator:false
        }
      ]
    },
    {
      header:"/Financial",
      icon:"account_balance",
      title: "Financial",
      children:[
        {
          title:"Wallet",
          icon:"mdi-wallet-outline",
          to:"/backend/financial/wallet",
          separator:false
        },
        {
          title:"Balance",
          icon:"mdi-wallet-outline",
          to:"/backend/financial/balance",
          separator:false
        }]
    },
    {
      header:"/marketing",
      icon:"campaign",
      title:"Marketing",
      children:[
        {
          title:"Promotion",
          icon:"mdi-gift-outline",
          to:"/backend/marketing/promotion",
          separator:false
        },
        {
          title:"Redeem",
          icon:"redeem",
          to:"/backend/marketing/point",
          separator:false
        }
      ]
    },
    {
      header:"/setting",
      title: "Settings",
      icon:"settings",
      children:[
        {
          title:"User",
          icon:"people_alt",
          to:"/backend/setting/user",
          separator:false
        }
      ]
    }
  ]