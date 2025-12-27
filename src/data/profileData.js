const profiletabData = {
  Seller: [
    { key: "sellerdashboard", label: "Dashboard" },
    {
      key: "sellerlist",
      label: "My Listing",
      children: [
        { key: "sellerBusiness", label: "All Businesses" },
        { key: "sellerSoldBusiness", label: "Sold Businesses" },
      ],
    },
    {
      key: "sellermeeting",
      label: "Meetings (10)",
    },
    { key: "sellerdeals", label: "Deals" },
    { key: "selleralert", label: "Alerts" },
    { key: "sellerwallet", label: "Wallet" },
  ],
  Buyer: [
    { key: "buyerdashboard", label: "Dashboard" },
    { key: "buyeroffers", label: "Offers" },
    { key: "buyermeeting", label: "Meetings" },
    { key: "buyerdeals", label: "Deals" },
    { key: "buyerfavlist", label: "Favorite Listing" },
    { key: "buyeralert", label: "Alerts" },
  ],
};

export { profiletabData };
