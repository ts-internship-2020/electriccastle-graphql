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

    async updateConferenceXAttendee({ attendeeEmail, conferenceId, statusId }) {
        const current = await this.knex
            .select("Id", "AttendeeEmail", "ConferenceId")
            .from("ConferenceXAttendee")
            .where("AttendeeEmail", attendeeEmail)
            .andWhere("ConferenceId", conferenceId)
            .first()
    
        const attendeeInfo = {
            AttendeeEmail: attendeeEmail,
            ConferenceId: conferenceId,
            StatusId: statusId
        }

        let result
        if (current && current.id) {
            result = await this.knex("ConferenceXAttendee")
                .update(attendeeInfo, "StatusId")
                .where("Id", current.id)
        } else {
            result = await this.knex("ConferenceXAttendee")
                .returning("StatusId")
                .insert(attendeeInfo);
        }
        return result[0]
    }

    async updateLocation(location) {
        const content = {
            Name: location.name,
            Address: location.address,
            Latitude: location.latitude,
            Longitude: location.longitude,
            CityId: location.cityId,
            CountyId: location.countyId,
            CountryId: location.countyId
        }
        const output = [
            "Id",
            "Name",
            "Address",
            "Latitude",
            "Longitude",
            "CityId",
            "CountyId",
            "CountryId"
        ]
    
        let result
        if (location.id) {
            result = await this.knex('Location')
                .update(content, output)
                .where("Id", location.id)
        }
        else {
            result = await this.knex('Location')
                .returning(output)
                .insert(content)
        }
    
        return result[0]
    }
    
    async updateConference({ id, name, organizerEmail, startDate, endDate, location, category, type }) {
        const content = {
            Name: name,
            OrganizerEmail: organizerEmail,
            StartDate: startDate,
            EndDate: endDate,
            LocationId: location.id,
            ConferenceTypeId: type.id,
            CategoryId: category.id
        }
        const output = [
            "Id",
            "ConferenceTypeId",
            "LocationId",
            "OrganizerEmail",
            "CategoryId",
            "StartDate",
            "EndDate",
            "Name"
        ]
        let result
        if (id) {
            result = await this.knex('Conference')
                .update(content, output)
                .where("Id", id)
        }
        else {
            result = await this.knex('Conference')
                .returning(output)
                .insert(content)
        }
        return result[0]
    }
    
    async updateSpeaker({ id, name, nationality, rating }) {
        const content = {
            Name: name,
            Nationality: nationality,
            Rating: rating
        }
        const outputSpeaker = [
            "Id",
            "Name",
            "Nationality",
            "Rating"
        ]
        let result
        if (id > 0) {
            result = await this.knex('Speaker')
                .update(content, outputSpeaker)
                .where("Id", id)
        }
        else {
            result = await this.knex('Speaker')
                .returning(outputSpeaker)
                .insert(content)
        }
        return result[0]
    }
    
    async updateConferenceXSpeaker({ speakerId, isMainSpeaker, conferenceId }) {
        const current = await this.knex
            .select("Id")
            .from("ConferenceXSpeaker")
            .where("SpeakerId", speakerId)
            .andWhere("ConferenceId", conferenceId)
            .first()
            
        let result
        if (current.id) {
            result = await this.knex('ConferenceXSpeaker')
                .update({ IsMainSpeaker: Boolean(isMainSpeaker) }, "IsMainSpeaker")
                .where("Id", current.id)
        }
        else {
            result = await this.knex('ConferenceXSpeaker')
                .returning("IsMainSpeaker")
                .insert({ SpeakerId: speakerId, IsMainSpeaker: Boolean(isMainSpeaker), ConferenceId: conferenceId })
        }
        return result[0]
    }
    
    async deleteSpeaker(speakerIds) {
        await this.knex("ConferenceXSpeaker")
            .whereIn("SpeakerId", speakerIds)
            .del()
        await this.knex("Speaker")
            .whereIn("Id", speakerIds)
            .del()
    }
}

module.exports = ConferenceDb;




// class ConferenceDb extends SQLDataSource {

//     async getConferenceListTotalCount(filters = {}) {
//                 return await this.knex("Conference")
//                     .count("ConferenceId", { as: "TotalCount" })
//                     .modify(this.generateWhereClause, filters)
//                     .first();
//     }
        
//     generateWhereClause(queryBuilder, filters = {}) {
//         const { startDate, endDate, organizerEmail } = filters;
    
//         if (startDate) queryBuilder.andWhere("StartDate", ">=", startDate);
//         if (endDate) queryBuilder.andWhere("EndDate", "<=", endDate);
//         if (organizerEmail) queryBuilder.andWhere("OrganizerEmail", organizerEmail)
//     }

//     async getConferenceList(pager, filters) {
//         const { page, pageSize } = pager;
//         const values = await this.knex
//             .select(
//                 "ConferenceId",
//                 "ConferenceName",
//                 "DictionaryConferenceTypeId",
//                 "LocationId",
//                 "DictionaryConferenceCategoryId",
//                 "StartDate",
//                 "EndDate"
//             )
//             .from("Conference")
//             .modify(this.generateWhereClause, filters)
//             .orderBy("ConferenceId")
//             .offset(page * pageSize)
//             .limit(pageSize)
        
//         let returnedValues = values.map( val => { 
//             return {
//                 id: val.ConferenceId, 
//                 name: val.ConferenceName,
//                 conferenceTypeId: val.DictionaryConferenceTypeId,
//                 locationId: val.LocationId,
//                 categoryId: val.DictionaryConferenceCategoryId,
//                 startDate: val.StartDate,
//                 endDate: val.EndDate
//             }
//         });

//         return returnedValues
//     }

//     async getCategoryList() {
//         const data = await this.knex
//             .select(
//                 "DictionaryConferenceCategoryId",
//                 "DictionaryConferenceCategoryName",
//                 "DictionaryConferenceCategoryCode"
//             )
//             .from("DictionaryConferenceCategory")

//         let returnedData

//         returnedData.Id = data.DictionaryConferenceCategoryId
//         returnedData.Name = data.DictionaryConferenceCategoryName
//         returnedData.Code = data.DictionaryConferenceCategoryCode

//         return returnedData;
//     }
    
//     async getTypeList() {
//         const data = await this.knex
//             .select(
//                 "DictionaryConferenceTypeId",
//                 "DictionaryConferenceTypeName",
//                 "DictionaryConferenceTypeCode"
//             )
//             .from("DictionaryConferenceType")
        
//         let returnedData

//         returnedData.Id = data.DictionaryConferenceTypeId
//         returnedData.Name = data.DictionaryConferenceTypeName
//         returnedData.Code = data.DictionaryConferenceTypeCode

//         return returnedData;
//     }
    
//     async getCountryList() {
//         const data = await this.knex
//             .select(
//                 "DictionaryCountryId",
//                 "DictionaryCountryName",
//                 "CountryCode"
//             )
//             .from("DictionaryCountry")
        
//         let returnedData

//         returnedData.Id = data.DictionaryCountryId
//         returnedData.Name = data.DictionaryCountryName
//         returnedData.Code = data.CountryCode

//         return returnedData;
//     }
    
//     async getCountyList() {
//         const data = await this.knex
//             .select(
//                 "DictionaryDistrictId",
//                 "DictionaryDistrictName",
//                 "DistrictCode"
//             )
//             .from("DictionaryDistrict")

//         let returnedData

//         returnedData.Id = data.DictionaryDistrictId
//         returnedData.Name = data.DictionaryDistrictName
//         returnedData.Code = data.DistrictCode

//         return returnedData;
//     }
    
//     async getCityList() {
//         const data = await this.knex
//             .select(
//                 "DictionaryCityId",
//                 "DictionaryCityName",
//                 "CityCode"
//             )
//             .from("DictionaryCity")

//         let returnedData

//         returnedData.Id = data.DictionaryCityId
//         returnedData.Name = data.DictionaryCityName
//         returnedData.Code = data.CityCode

//         return returnedData;
//     }

//     async updateConferenceXAttendee({ attendeeEmail, conferenceId, statusId }) {
//         const current = await this.knex
//             .select("DictionaryParticipantStateId", "ParticipantEmail", "ConferenceId")
//             .from("ConferenceParticipant")
//             .where("ParticipantEmail", attendeeEmail)
//             .andWhere("ConferenceId", conferenceId)
//             .first()
    
//         const attendeeInfo = {
//             ParticipantEmail: attendeeEmail,
//             ConferenceId: conferenceId,
//             DictionaryParticipantStateId: statusId
//         }

//         let result
//         if (current && current.id) {
//             result = await this.knex("ConferenceParticipant")
//                 .update(attendeeInfo, "DictionaryParticipantStateId")
//                 .where("Id", current.id)
//         } else {
//             result = await this.knex("ConferenceParticipant")
//                 .returning("DictionaryParticipantStateId")
//                 .insert(attendeeInfo);
//         }

//         let returnedStateId

//         returnedStateId.StatusId = result[0].DictionaryParticipantStateId

//         return returnedStateId
//     }

//     async updateLocation(location) {
//         const content = {
//             AddressDetails: location.address,
//             Latitude: location.latitude,
//             Longitude: location.longitude,
//             DictionaryCityId: location.cityId,
//         }
//         const output = [
//             "LocationId",
//             "AddressDetails",
//             "Latitude",
//             "Longitude",
//             "DictionaryCityId",
//         ]
    
//         let result
//         if (location.id) {
//             result = await this.knex('Location')
//                 .update(content, output)
//                 .where("Id", location.id)
//         }
//         else {
//             result = await this.knex('Location')
//                 .returning(output)
//                 .insert(content)
//         }

//         let returnedLocation
//         //
//         returnedLocation.Id = result[0].LocationId
//         returnedLocation.Name = ""
//         returnedLocation.Address = result[0].AddressDetails
//         returnedLocation.Latitude = result[0].Latitude
//         returnedLocation.Longitude = result[0].Longitude
//         returnedLocation.CityId = result[0].DictionaryCityId
//         returnedLocation.CountyId = location.CountyId
//         returnedLocation.CountryId = location.CountryId
//         //
    
//         return returnedLocation
//     }
    
//     async updateConference({ id, name, organizerEmail, startDate, endDate, location, category, type }) {
//         const content = {
//             ConferenceName: name,
//             OrganizerEmail: organizerEmail,
//             StartDate: startDate,
//             EndDate: endDate,
//             LocationId: location.id,
//             DictionaryConferenceTypeId: type.id,
//             DictionaryConferenceCategoryId: category.id
//         }
//         const output = [
//             "ConferenceId",
//             "DictionaryConferenceTypeId",
//             "LocationId",
//             "OrganizerEmail",
//             "DictionaryConferenceCategoryId",
//             "StartDate",
//             "EndDate",
//             "ConferenceName"
//         ]
//         let result
//         if (id) {
//             result = await this.knex('Conference')
//                 .update(content, output)
//                 .where("Id", id)
//         }
//         else {
//             result = await this.knex('Conference')
//                 .returning(output)
//                 .insert(content)
//         }

//         let returnedConference

//         returnedConference.Id = result[0].ConferenceId
//         returnedConference.ConferenceTypeId = result[0].DictionaryConferenceTypeId
//         returnedConference.LocationId = result[0].LocationId
//         returnedConference.OrganizerEmail = result[0].OrganizerEmail
//         returnedConference.CategoryId = result[0].DictionaryConferenceCategoryId
//         returnedConference.StartDate = result[0].StartDate
//         returnedConference.EndDate = result[0].EndDate
//         returnedConference.Name = result[0].ConferenceName

//         return returnedConference
//     }
    
//     async updateSpeaker({ id, name, nationality, rating }) {
//         const content = {
//             DictionarySpeakerName: name,
//             Nationality: nationality,
//             Rating: rating
//         }
//         const outputSpeaker = [
//             "DictionarySpeakerId",
//             "DictionarySpeakerName",
//             "Nationality",
//             "Rating"
//         ]
//         let result
//         if (id > 0) {
//             result = await this.knex('Speaker')
//                 .update(content, outputSpeaker)
//                 .where("Id", id)
//         }
//         else {
//             result = await this.knex('Speaker')
//                 .returning(outputSpeaker)
//                 .insert(content)
//         }

//         let returnedSpeaker

//         returnedSpeaker.Id = result[0].DictionarySpeakerId
//         returnedSpeaker.Name = result[0].DictionarySpeakerName
//         returnedSpeaker.Nationality = result[0].Nationality
//         returnedSpeaker.Rating = result[0].Rating

//         return returnedSpeaker
//     }
    
//     async updateConferenceXSpeaker({ speakerId, isMainSpeaker, conferenceId }) {
//         const current = await this.knex
//             .select("DictionarySpeakerId", "ConferenceId")
//             .from("ConferenceXDictionarySpeaker")
//             .where("DictionarySpeakerId", speakerId)
//             .andWhere("ConferenceId", conferenceId)
//             .first()
            
//         let result
//         if (current.DictionarySpeakerId && current.ConferenceId) {
//             result = await this.knex('ConferenceXDictionarySpeaker')
//                 .update({ IsMainSpeaker: Boolean(isMainSpeaker) }, "IsMainSpeaker")
//                 .where("Id", current.id)
//         }
//         else {
//             result = await this.knex('ConferenceXDictionarySpeaker')
//                 .returning("IsMainSpeaker")
//                 .insert({ DictionarySpeakerId: speakerId, IsMainSpeaker: Boolean(isMainSpeaker), ConferenceId: conferenceId })
//         }

//         return result[0]
//     }
    
//     async deleteSpeaker(speakerIds) {
//         await this.knex("ConferenceXDictionarySpeaker")
//             .whereIn("DictionarySpeakerId", speakerIds)
//             .del()
//         await this.knex("DictionarySpeaker")
//             .whereIn("DictionarySpeakerId", speakerIds)
//             .del()
//     }

// }

