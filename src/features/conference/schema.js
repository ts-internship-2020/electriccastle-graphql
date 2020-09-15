const { gql } = require('apollo-server');

const conferenceTypeDefs = gql`

type Type {
  id: Int!
  name: String!
  code: String
}
type Category {
  id: Int!
  name: String!
  code: String
}
type Country {
  id: Int!
  name: String!
  code: String    
}
type County {
  id: Int!
  name: String!
  code: String    
}
type City {
  id: Int!
  name: String!
  code: String    
}

type Conference {
  id: ID!
  name: String!
  startDate: DateTime!
  endDate: DateTime!
  type: Type
  category: Category
  location: Location!
  speakers: [Speaker!]!
  status(userEmail: String!): Status
}

type Location {
  id: ID!
  name: String
  address: String
  latitude: String
  longitude: String
  city: City!
  county: County!
  country: Country!
}

type Speaker {
  id: ID!
  name: String
  isMainSpeaker: Boolean
  nationality: String
  rating: Float
}

type Status {
    id: ID!
    name: String!
}

type ConferenceList {
  values: [Conference!]!
  pagination(pager: PagerInput!, filters: ConferenceFilterInput): Pagination
}

input ConferenceFilterInput {
  startDate: DateTime
  endDate: DateTime
  organizerEmail: String
}

extend type Query {
  conference(id: ID!): Conference!
  conferenceList(pager: PagerInput!, filters: ConferenceFilterInput): ConferenceList
  categoryList: [Category!]!
  typeList: [Type!]!
  countryList: [Country!]!
  countyList: [County!]!
  cityList: [City!]!
}
`;

module.exports = conferenceTypeDefs;