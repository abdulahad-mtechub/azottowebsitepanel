import { gql } from "@apollo/client";

const GET_CATEGORIES = gql`
query GetAllCategories($limit: Int, $offSet: Int, $filter: CategoryFilter) {
  getAllCategories(limit: $limit, offSet: $offSet, filter: $filter) {
    totalcount
    categories {
    id
    isDigital
    name
    arabicName
    }
  }
}
`
const GET_CATEGORY = gql`
    query GetCategoryById($getCategoryByIdId: ID!) {
  getCategoryById(id: $getCategoryByIdId) {
    id
    isDigital
    name
    arabicName
  }
}
`
const GET_ALL_BUSINESSES = gql`
    query GetAllBusinesses($limit: Int, $offSet: Int, $filter: BusinessFilterInput, $sort: BusinessSortInput) {
    getAllBusinesses(limit: $limit, offSet: $offSet, filter: $filter, sort: $sort) {
    businesses {
      isByTakbeer
      isSaved
      id
        category {
        name
        arabicName
      }
      businessStatus
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
const GET_BUSINESS = gql`
   query GetBusinessById($getBusinessByIdId: ID!) {
  getBusinessById(id: $getBusinessByIdId) {
    numberOfFavorites
    numberOfOffers
    totalViews
    business {
      id
      businessTitle
      isSupportVerified
      reference
      district
      city
      description
      foundedDate
      growthOpportunities
      isByTakbeer
      multiple
      numberOfEmployees
      price
      profit
      profitMargen
      profittime
      reason
      capitalRecovery
      revenue
      revenueTime
      supportSession
      supportDuration
      businessStatus
      url
      isStatsVerified
      category {
        id
        name
      }
      savedBy {
        id
      }
      seller {
        id
      }
      assets {
        id
        isActive
        name
        price
        purchaseYear
        quantity
      }
      liabilities {
        id
        isActive
        name
        price
        purchaseYear
        quantity
      }
      inventoryItems {
        id
        isActive
        name
        price
        purchaseYear
        quantity
      }
    }
  }
}
`
const GET_RANDOM_BUSINESSES = gql`
query GetRandomBusinesses($getRandomBusinessesId: ID!) {
  getRandomBusinesses(id: $getRandomBusinessesId) {
    id
    category {
      name
    }
    businessTitle
    description
    revenue
    profit
    price
    isByTakbeer
    capitalRecovery
    isSaved
    multiple
  }
}
`
const GET_BUSINESS_BY_CATEGORY = gql`
query GetAllBusinessesByCategory($category: String!, $limit: Int, $offSet: Int) {
  getAllBusinessesByCategory(category: $category, limit: $limit, offSet: $offSet) {
    businesses {
      id
      businessTitle
      description
      revenue
      profit
      price
      capitalRecovery
      multiple
      savedBy {
        id
      }
      category {
        name
      }
    }
    totalCount
  }
}
`
const GET_BUSINESS_BY_CITY = gql`
query GetAllBusinessesByCity($city: String!, $limit: Int, $offSet: Int) {
  getAllBusinessesByCity(city: $city, limit: $limit, offSet: $offSet) {
    businesses {
      id
      businessTitle
      description
      revenue
      profit
      price
      capitalRecovery
      multiple
      savedBy {
        id
      }
      category {
        name
      }
    }
    totalCount
  }
}
`
const GET_BUSINESS_BY_DISTRICT = gql`
query getAllBusinessesByDistrict($district: String!, $limit: Int, $offSet: Int) {
  getAllBusinessesByDistrict(district: $district, limit: $limit, offSet: $offSet) {
    businesses {
      id
      businessTitle
      description
      revenue
      profit
      price
      capitalRecovery
      multiple
      savedBy {
        id
      }
      category {
        name
      }
    }
    totalCount
  }
}
`
const GET_BUSINESS_BY_PROFIT = gql`
query GetAllBusinessesByProfit($profit: [Float]!, $limit: Int, $offSet: Int) {
  getAllBusinessesByProfit(profit: $profit, limit: $limit, offSet: $offSet) {
    businesses {
      id
      businessTitle
      description
      revenue
      profit
      price
      capitalRecovery
      multiple
      savedBy {
        id
      }
      category {
        name
      }
    }
    totalCount
  }
}
`
const GET_BUSINESS_BY_REVENUE = gql`
query GetAllBusinessesByRevenue($revenue: [Float]!, $limit: Int, $offSet: Int) {
  getAllBusinessesByRevenue(revenue: $revenue, limit: $limit, offSet: $offSet) {
    businesses {
      id
      businessTitle
      description
      revenue
      profit
      price
      capitalRecovery
      multiple
      savedBy {
        id
      }
      category {
        name
      }
    }
    totalCount
  }
}
`
const SIMILER_BUSINESS_CATEGORY_GRAPH = gql`
query SimilerBusinessAvgAnualProfit($similerBusinessAvgAnualProfitId: ID) {
  similerBusinessAvgAnualProfit(id: $similerBusinessAvgAnualProfitId) {
    totalProfit
    graph {
      profit
      year
    }
  }
}
`
const GET_BUYER_OFFER = gql`
query GetOffersByUser($search: String, $status: String) {
  getOffersByUser(search: $search, status: $status) {
    id
    price
    status
    createdAt
    createdBy
    business {
      id
      businessTitle
      price
      seller {
        id
        name
      }
    }
    buyer {
      id
    }
  }
}
`

const GETRANDOMBUSINESS = gql`
query GetRandomBusinesses {
  getRandomBusinesses {
    id
    category {
      name
    }
    reference
    businessTitle
    description
    price
    isSaved
    isSold
    isByTakbeer
    revenue
    profit
    capitalRecovery
  }
}`
export {
    GET_CATEGORIES,
    GET_CATEGORY,
    GET_ALL_BUSINESSES,
    GET_BUSINESS,
    GET_RANDOM_BUSINESSES,
    GET_BUSINESS_BY_CATEGORY,
    GET_BUSINESS_BY_CITY,
    GET_BUSINESS_BY_PROFIT,
    GET_BUSINESS_BY_REVENUE,
    GET_BUSINESS_BY_DISTRICT,
    SIMILER_BUSINESS_CATEGORY_GRAPH,
    GET_BUYER_OFFER,
    GETRANDOMBUSINESS
}
