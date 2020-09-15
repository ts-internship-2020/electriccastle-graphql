const { SQLDataSource } = require("../../utils/sqlDataSource");

class ConferenceDb extends SQLDataSource {

    async getConferenceListTotalCount(filters = {}) {
        return await this.knex("Conference")
            .count("Id", { as: "TotalCount" })
            .modify(this.generateWhereClause, filters)
            .first();
    }

    generateWhereClause(queryBuilder, filters = {}) {
        const { startDate, endDate, organizerEmail } = filters;
    
        if (startDate) queryBuilder.andWhere("StartDate", ">=", startDate);
        if (endDate) queryBuilder.andWhere("EndDate", "<=", endDate);
        if (organizerEmail) queryBuilder.andWhere("OrganizerEmail", organizerEmail)
    }

    async getConferenceList(pager, filters) {
        const { page, pageSize } = pager;
        const values = await this.knex
            .select(
                "Id",
                "Name",
                "ConferenceTypeId",
                "LocationId",
                "CategoryId",
                "StartDate",
                "EndDate"
            )
            .from("Conference")
            .modify(this.generateWhereClause, filters)
            .orderBy("Id")
            .offset(page * pageSize)
            .limit(pageSize)
        return { values };
    }

    async getCategoryList() {
        const data = await this.knex
            .select(
                "Id",
                "Name",
                "Code"
            )
            .from("DictionaryCategory")
        return data;
    }
    
    async getTypeList() {
        const data = await this.knex
          .select(
            "Id",
            "Name",
            "Code"
        )
        .from("DictionaryConferenceType")
        return data;
    }
    
    async getCountryList() {
        const data = await this.knex
        .select(
            "Id",
            "Name",
            "Code"
        )
        .from("DictionaryCountry")
        return data;
    }
    
    async getCountyList() {
        const data = await this.knex
          .select(
            "Id",
            "Name",
            "Code"
        )
        .from("DictionaryCounty")
        return data;
      }
    
      async getCityList() {
        const data = await this.knex
          .select(
            "Id",
            "Name",
            "Code"
          )
          .from("DictionaryCity")
        return data;
      }
}

module.exports = ConferenceDb;