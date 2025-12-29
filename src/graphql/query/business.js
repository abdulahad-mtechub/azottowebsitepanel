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
`;
const GET_CATEGORY = gql`
  query GetCategoryById($getCategoryByIdId: ID!) {
    getCategoryById(id: $getCategoryByIdId) {
      id
      isDigital
      name
      arabicName
    }
  }
`;
const GET_ALL_BUSINESSES = gql`
  query GetAllBusinesses(
    $limit: Int
    $offSet: Int
    $filter: BusinessFilterInput
    $sort: BusinessSortInput
  ) {
    getAllBusinesses(
      limit: $limit
      offSet: $offSet
      filter: $filter
      sort: $sort
    ) {
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
`;
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
        isAbleInActive
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
          arabicName
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
        documents {
          id
          title
          fileName
          fileType
          filePath
          description
        }
      }
    }
  }
`;
const GET_RANDOM_BUSINESSES = gql`
  query GetRandomBusinesses($getRandomBusinessesId: ID!, $userId: ID) {
    getRandomBusinesses(id: $getRandomBusinessesId, userId: $userId) {
      id
      category {
        name
        arabicName
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
`;
const GET_BUSINESS_BY_CATEGORY = gql`
  query GetAllBusinessesByCategory(
    $category: String!
    $limit: Int
    $offSet: Int
    $sort: BusinessSortInput
  ) {
    getAllBusinessesByCategory(
      category: $category
      limit: $limit
      offSet: $offSet
      sort: $sort
    ) {
      businesses {
        id
        businessTitle
        description
        revenue
        profit
        isSaved
        price
        isByTakbeer
        capitalRecovery
        multiple
        savedBy {
          id
        }
        category {
          name
          arabicName
        }
      }
      totalCount
    }
  }
`;
const GET_BUSINESS_BY_CITY = gql`
  query GetAllBusinessesByCity(
    $city: String!
    $limit: Int
    $offSet: Int
    $sort: BusinessSortInput
  ) {
    getAllBusinessesByCity(
      city: $city
      limit: $limit
      offSet: $offSet
      sort: $sort
    ) {
      businesses {
        id
        businessTitle
        description
        revenue
        profit
        price
        capitalRecovery
        isByTakbeer
        isSaved
        multiple
        savedBy {
          id
        }
        category {
          name
          arabicName
        }
      }
      totalCount
    }
  }
`;
const GET_BUSINESS_BY_DISTRICT = gql`
  query getAllBusinessesByDistrict(
    $district: String!
    $limit: Int
    $offSet: Int
    $sort: BusinessSortInput
  ) {
    getAllBusinessesByDistrict(
      district: $district
      limit: $limit
      offSet: $offSet
      sort: $sort
    ) {
      businesses {
        id
        businessTitle
        description
        revenue
        profit
        price
        isSaved
        isByTakbeer
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
`;
const GET_BUSINESS_BY_PROFIT = gql`
  query GetAllBusinessesByProfit(
    $profit: [Float]!
    $limit: Int
    $offSet: Int
    $sort: BusinessSortInput
  ) {
    getAllBusinessesByProfit(
      profit: $profit
      limit: $limit
      offSet: $offSet
      sort: $sort
    ) {
      businesses {
        id
        businessTitle
        description
        revenue
        profit
        price
        isSaved
        capitalRecovery
        isByTakbeer
        multiple
        savedBy {
          id
        }
        category {
          name
          arabicName
        }
      }
      totalCount
    }
  }
`;
const GET_BUSINESS_BY_REVENUE = gql`
  query GetAllBusinessesByRevenue(
    $revenue: [Float]!
    $limit: Int
    $offSet: Int
    $sort: BusinessSortInput
  ) {
    getAllBusinessesByRevenue(
      revenue: $revenue
      limit: $limit
      offSet: $offSet
      sort: $sort
    ) {
      businesses {
        id
        businessTitle
        description
        revenue
        isSaved
        profit
        price
        capitalRecovery
        isByTakbeer
        multiple
        savedBy {
          id
        }
        category {
          name
          arabicName
        }
      }
      totalCount
    }
  }
`;
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
`;
const GET_BUYER_OFFER = gql`
  query GetOffersByUser(
    $search: String
    $status: String
    $limit: Int
    $offSet: Int
    $isProceedToPay: Boolean
  ) {
    getOffersByUser(
      search: $search
      status: $status
      limit: $limit
      offSet: $offSet
      isProceedToPay: $isProceedToPay
    ) {
      count
      offers {
        id
        price
        status
        createdAt
        createdBy
        isProceedToPay
        commission
        business {
          id
          businessTitle
          price
          businessStatus
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
  }
`;

const GETRANDOMBUSINESS = gql`
  query GetRandomBusinesses($userId: ID) {
    getRandomBusinesses(userId: $userId) {
      id
      category {
        name
        arabicName
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
  }
`;

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
  GETRANDOMBUSINESS,
};
