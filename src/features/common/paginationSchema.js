const { gql } = require("apollo-server-koa");

const paginationTypes = gql`
  input PagerInput {
    page: Int!
    pageSize: Int!
  }

  type Page {
    page: Int!
    pageSize: Int!
  }

  type Pagination {
    currentPage: Page
    totalCount: Int
  }
`;
module.exports = paginationTypes;
