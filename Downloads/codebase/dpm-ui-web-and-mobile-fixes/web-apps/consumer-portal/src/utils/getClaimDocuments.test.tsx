import { getClaimDocuments } from "./getClaimDocuments";

describe("getClaimDocuments", () => {
  const rules = [
    {
       "condition":[
          {
             "value":null,
             "fieldName":"estimateAmount",
             "operator":"EQUAL"
          },
          {
             "value":"TPL",
             "fieldName":"claimRequestType",
             "operator":"EQUAL"
          },
          {
             "value":"Police",
             "fieldName":"caseReportedType",
             "operator":"EQUAL"
          }
       ],
       "documents":[
          {
             "key":"morror_report",
             "value":"Morror Report",
             "required":true
          },
          {
             "key":"quotation",
             "value":"Quotation",
             "required":false
          }
       ]
    },
    {
       "condition":[
          {
             "value":null,
             "fieldName":"liabilityPercentage",
             "operator":"EQUAL"
          },
          {
             "value":"TPL",
             "fieldName":"claimRequestType",
             "operator":"EQUAL"
          },
          {
             "value":"Najm",
             "fieldName":"caseReportedType",
             "operator":"EQUAL"
          }
       ],
       "documents":[
          {
             "key":"accident_report",
             "value":"Accident Report",
             "required":true
          },
          {
             "key":"quotation",
             "value":"Quotation",
             "required":false
          }
       ]
    },
    {
       "condition":[
          {
             "value":null,
             "fieldName":"estimateAmount",
             "operator":"EQUAL"
          },
          {
             "value":"OD",
             "fieldName":"claimRequestType",
             "operator":"EQUAL"
          },
          {
             "value":"Police",
             "fieldName":"caseReportedType",
             "operator":"EQUAL"
          }
       ],
       "documents":[
          {
             "key":"morror_report",
             "value":"Morror Report",
             "required":true
          },
          {
             "key":"quotation",
             "value":"Quotation",
             "required":false
          }
       ]
    },
    {
       "condition":[
          {
             "value":"50",
             "fieldName":"liabilityPercentage",
             "operator":"GREATER"
          },
          {
             "value":"OD",
             "fieldName":"claimRequestType",
             "operator":"EQUAL"
          },
          {
             "value":"Najm",
             "fieldName":"caseReportedType",
             "operator":"EQUAL"
          }
       ],
       "documents":[
          {
             "key":"accident_report",
             "value":"Accident Report",
             "required":true
          },
          {
             "key":"quotation",
             "value":"Quotation",
             "required":false
          }
       ]
    },
    {
       "condition":[
          {
             "value":"0",
             "fieldName":"liabilityPercentage",
             "operator":"EQUAL"
          },
          {
             "value":"OD",
             "fieldName":"claimRequestType",
             "operator":"EQUAL"
          },
          {
             "value":"Najm",
             "fieldName":"caseReportedType",
             "operator":"EQUAL"
          }
       ],
       "documents":[
          {
             "key":"morror_report",
             "value":"Morror Report",
             "required":true
          },
          {
             "key":"quotation",
             "value":"Quotation",
             "required":false
          }
       ]
    },
    {
       "condition":[
          {
             "value":"0",
             "fieldName":"liabilityPercentage",
             "operator":"EQUAL"
          },
          {
             "value":"TPL",
             "fieldName":"claimRequestType",
             "operator":"EQUAL"
          },
          {
             "value":"Najm",
             "fieldName":"caseReportedType",
             "operator":"EQUAL"
          }
       ],
       "documents":[
          {
             "key":"accident_report",
             "value":"Accident Report",
             "required":true
          },
          {
             "key":"quotation",
             "value":"Quotation",
             "required":false
          }
       ]
    },
    {
       "condition":[
          {
             "value":"100",
             "fieldName":"liabilityPercentage",
             "operator":"LESS"
          },
          {
             "value":"OD",
             "fieldName":"claimRequestType",
             "operator":"EQUAL"
          },
          {
             "value":"Najm",
             "fieldName":"caseReportedType",
             "operator":"EQUAL"
          }
       ],
       "documents":[
          {
             "key":"spare_parts",
             "value":"Spare Parts",
             "required":true
          },
          {
             "key":"other_document",
             "value":"Other Document",
             "required":false
          }
       ]
    }
 ]

  it("should return the correct documents for matching conditions", () => {
    const inputData = {
      claimRequestType: "TPL",
      estimateAmount: null,
      liabilityPercentage: null,
      caseReportedType: "Police",
    };

    const result = getClaimDocuments(rules, inputData);

    expect(result).toEqual([
      { key: "morror_report", value: "Morror Report", required: true },
      { key: "quotation", value: "Quotation", required: false },
    ]);
  });

  it("should return an empty array when no conditions match", () => {
    const inputData = {
      claimRequestType: "OD",
      estimateAmount: 5000,
      liabilityPercentage: 50,
      caseReportedType: "Unknown",
    };

    const result = getClaimDocuments(rules, inputData);

    expect(result).toEqual([]);
  });

  it("should handle conditions with GREATER operator", () => {
    const inputData = {
      claimRequestType: "OD",
      estimateAmount: null,
      liabilityPercentage: 60,
      caseReportedType: "Najm",
    };

    const result = getClaimDocuments(rules, inputData);

    expect(result).toEqual([
      { key: "accident_report", value: "Accident Report", required: true },
      { key: "quotation", value: "Quotation", required: false },
    ]);
  });

  it("should handle conditions with LESS operator", () => {
    const inputData = {
      claimRequestType: "OD",
      estimateAmount: null,
      liabilityPercentage: 90,
      caseReportedType: "Najm",
    };

    const result = getClaimDocuments(rules, inputData);

    expect(result).toEqual([
      { key: "accident_report", value: "Accident Report", required: true },
      { key: "quotation", value: "Quotation", required: false },
    ]);
  });

  it("should handle conditions with EQUAL operator and specific values", () => {
    const inputData = {
      claimRequestType: "TPL",
      estimateAmount: null,
      liabilityPercentage: 0,
      caseReportedType: "Najm",
    };

    const result = getClaimDocuments(rules, inputData);

    expect(result).toEqual([
      { key: "accident_report", value: "Accident Report", required: true },
      { key: "quotation", value: "Quotation", required: false },
    ]);
  });
});