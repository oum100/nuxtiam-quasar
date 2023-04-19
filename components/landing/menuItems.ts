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
      title: "Financial",
      to: "/backend/dashboard/financial",
      icon:"account_balance",
      separator:false,
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
      title: "Settings",
      to: "/backend/dashboard/settings",
      icon:"settings",
      separator:false,
    }
  ]