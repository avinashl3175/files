/**
 * Utils
 *
 * @description :: It will keep all commmon scripts for the application
 * @author      :: Avinash K
 */

class Utils {
    constructor() { }

    checkIfPropertyExits(input, key) {
        try {
            return input.hasOwnProperty(key);
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    checkIfValueExits(input, key) {
        try {
            let output;
            switch (input[key]) {
                case null:
                case undefined:
                case "":
                case NaN:
                    output = false;
                    break;
                default:
                    output = true;
                    break;
            }
            if(_.isEmpty(input[key])) output = false;
            return output;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    formESQuery_report(input = {}) {
        try {
            const query = { "bool": { "must": [] } };
            //it will check property exists and its value should not be undefined or null
            if (utils.checkIfPropertyExits(input, "ReportStatus") && utils.checkIfValueExits(input, "ReportStatus")) {
                query.bool.must.push({ "match": { "ReportStatus": input.ReportStatus } });
            }
            if (utils.checkIfPropertyExits(input, "IsSTAT") && utils.checkIfValueExits(input, "IsSTAT")) {
                query.bool.must.push({ "match": { "IsSTAT": input.IsSTAT } });
            }
            if (utils.checkIfPropertyExits(input, "FirstName") && utils.checkIfValueExits(input, "FirstName")) {
                query.bool.must.push({ "match_phrase_prefix": { "medicalReport.Patient.FirstName": input.FirstName } });
            }
            if (utils.checkIfPropertyExits(input, "LastName") && utils.checkIfValueExits(input, "LastName")) {
                query.bool.must.push({ "match_phrase_prefix": { "medicalReport.Patient.LastName": input.LastName } });
            }
            if (utils.checkIfPropertyExits(input, "DOB") && utils.checkIfValueExits(input, "DOB")) {
                query.bool.must.push({ "match": { "medicalReport.Patient.DOB": {"query": input.DOB,"operator":"and" }}});
            }
            if (utils.checkIfPropertyExits(input, "ProviderCode") && utils.checkIfValueExits(input, "ProviderCode")) {
                const queryProviderCode = { "bool": { "should": [] } };
                input.ProviderCode.forEach((item) => {
                    queryProviderCode.bool.should.push({ "match": { "ProviderCode": item } });
                });
                query.bool.must.push(queryProviderCode);
            }
            return query;
        } catch (error) {
            console.log(error);
        }
    }

    filterESResult_report(input = {}) {
        try {
            let result;
            if (input.medicalReport && input.HL7) {
                input.DecryptedHL7JSONData = {
                    "ReportRenderFormat": "PDF",
                    "MedicalReport": JSON.stringify(input.medicalReport)
                };
                input.DecryptedHL7 = input.HL7;
                result = _.omit(input, ['medicalReport', 'HL7']);
            }
            else {
                result = input;
            }
            return result;
        } catch (error) {
            return error;
        }
    }

    createESRequest(input = {}) {
        try {
            const sort = [];
            if (sort) {
                const splitSort = input.sort.split(' ');
                if (splitSort.length == 2) {
                    const keyName = splitSort[0],
                        orderBy = splitSort[1],
                        sortObj = {
                            [keyName]: {
                                "order": orderBy
                            }
                        };
                    sort.push(sortObj);
                }
            }
            const output = {
                "query": input.query || { "bool": { "must": [] } },
                "sort": sort,
                "size": input.size || 20,
                "from": input.from || 0
            }
            return output;
        } catch (error) {
            return {};
            console.log(error);
        }
    }
}

//Since this reference not available within utils class member function,
//so reffering utils object within class members
const utils = new Utils(); 

module.exports.utils = Utils;