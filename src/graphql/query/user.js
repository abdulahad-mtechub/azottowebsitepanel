import { gql } from "@apollo/client";

const ME = gql`
  query GetUserDetails($getUserDetailsId: ID!) {
    getUserDetails(id: $getUserDetailsId) {
      id
      name
      email
      phone
      city
      district
    }
  }
`

const NOTIFICATION = gql`
  query GetNotifications($userId: ID!, $limit: Int, $offSet: Int) {
    getNotifications(userId: $userId, limit: $limit, offSet: $offSet) {
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
  query GetProfileStatistics($startDate: String, $endDate: String) {
    getProfileStatistics(startDate: $startDate, endDate: $endDate) {
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
  query GetBuyerStatistics($startDate: String, $endDate: String) {
    getBuyerStatistics(startDate: $startDate, endDate: $endDate) {
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
const GETFAVORITBUSINESS = gql`
  query GetFavoritBusiness($limit: Int, $offSet: Int) {
    getFavoritBusiness(limit: $limit, offSet: $offSet) {
      businesses {
        id
        category {
          name
        }
      businessStatus
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
      totalCount
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
    iban
    isActive
  }
}
  `
  const GETBANKBYUSERID = gql`
query GetUserBanks($getUserBanksId: ID) {
  getUserBanks(id: $getUserBanksId) {
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
    GETFAVORITBUSINESS,
    GETADMINBANK,
    GETADMINACTIVEBANK,
    GETUSERBANK,
    GETUSERACTIVEBANK,
    GETBANKBYUSERID
}
