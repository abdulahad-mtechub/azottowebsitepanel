import { gql } from "@apollo/client";

const ME = gql`
   query GetUser($getUserId: ID!) {
  getUser(id: $getUserId) {
    id
    name
    email
    phone
    city
    district
    documents {
      fileName
      filePath
    }
    banks {
      accountTitle
      bankName
      iban
      cardNumber
      cardType
      isActive
    }
    role{
      id
      name
    }
  }
}
`

const NOTIFICATION = gql`
query GetNotifications($userId: ID!) {
  getNotifications(userId: $userId) {
    count
    notifications {
      id
      createdAt
      isRead
      name
      message
      user {
        id
        name
      }
    }
  }
}
`
const PROFESSIONALSTATISTICS = gql`
  query GetProfileStatistics {
  getProfileStatistics {
    finalizedDealsCount
    listedBusinessesCount
    pendingMeetingsCount
    receivedOffersCount
    scheduledMeetingsCount
    viewedBusinessesCount
  }
}
`
const GETBUYERSTATISTICS = gql`
  query GetBuyerStatistics {
  getBuyerStatistics {
    finalizedDealsCount
    scheduledMeetingsCount
    favouriteBusinessesCount
  }
}
`
const GETSELLERBUSINESS = gql`
query GetAllSellerBusinesses($limit: Int, $offSet: Int) {
  getAllSellerBusinesses(limit: $limit, offSet: $offSet) {
    totalActiveCount
    totalCount
    totalPendingCount
    businesses {
    id
    offerCount
    businessStatus
    isByTakbeer
    businessTitle
    description
    revenue
    profit
    price
    capitalRecovery
    savedBy {
      id
    }
    category {
      id
      name
    }
    }
  }
}
`
const GETBUYERBUSINESS = gql`
query GetAllBuyerBusinesses($limit: Int, $offSet: Int) {
  getAllBuyerBusinesses(limit: $limit, offSet: $offSet) {
    businesses {
    id
      category {
      name
    }
    businessTitle
    description
    revenue
    profit
    price
    capitalRecovery
    savedBy {
      id
    }
    }
    totalCount
  }
}
`
const GETSELLERSOLDBUSINESS = gql`
query GetAllSellerSoldBusinesses($limit: Int, $offSet: Int) {
  getAllSellerSoldBusinesses(limit: $limit, offSet: $offSet) {
    businesses {
    id
      category {
      name
    }
    businessStatus
    isByTakbeer
    businessTitle
    description
    revenue
    profit
    price
    capitalRecovery
    savedBy {
      id
    }
    }
    totalCount
  }
}
`
const GETBUYERBOUGHTBUSINESS = gql`
query GetAllBuyerBoughtBusinesses($limit: Int, $offSet: Int) {
  getAllBuyerBoughtBusinesses(limit: $limit, offSet: $offSet) {
    businesses {
    id
      category {
      name
    }
    businessTitle
    description
    revenue
    profit
    price
    capitalRecovery
    savedBy {
      id
    }
    }
    totalCount
  }
}
`
const GETFAVORITBUSINESS = gql`
query GetFavoritBusiness {
  getFavoritBusiness {
    id
      category {
      name
    }
    offerCount
    isByTakbeer
    businessTitle
    description
    revenue
    profit
    price
    capitalRecovery
    savedBy {
      id
    }
  }
}
`

const GETADMINBANK = gql`
query GetAdminBanks {
  getAdminBanks {
    id
    accountTitle
    bankName
    iban
    accountNumber
    createdAt
  }
}
`

const GETADMINACTIVEBANK = gql`
query GetActiveAdminBank {
  getActiveAdminBank {
    id
    accountTitle
    bankName
    accountNumber
    createdAt
    accountTitle
    iban
  }
}
`
const GETUSERBANK = gql`
query GetUserBanks {
  getUserBanks {
    id
    bankName
    accountNumber
    createdAt
    accountTitle
    isActive
  }
}
  `
const GETUSERACTIVEBANK = gql`
  query GetUserActiveBanks($getUserActiveBanksId: ID) {
    getUserActiveBanks(id: $getUserActiveBanksId) {
      accountTitle
      bankName
      iban
      cardNumber
      cardType
      isActive
      id
    }
  }
`
export {
    ME,
    NOTIFICATION,
    PROFESSIONALSTATISTICS,
    GETBUYERSTATISTICS,
    GETSELLERBUSINESS,
    GETBUYERBUSINESS,
    GETSELLERSOLDBUSINESS,
    GETBUYERBOUGHTBUSINESS,
    GETFAVORITBUSINESS,
    GETADMINBANK,
    GETADMINACTIVEBANK,
    GETUSERBANK,
    GETUSERACTIVEBANK
}
