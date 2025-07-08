export const calculatePremiumPayload = {
    "policyEffectiveDate": "2025-03-01T00:00:00",
    "travelDuration": "180",
    "familyIndividual": "2", //Individual=2 , Family=1
    "plan": "1",
    "ratingType":"General Tariff",
    "policyRisk": [
        {
            "dateOfBirth": "1989-01-02",
            "dateOfBirthH": "1989-01-02",
            "relation": "5", //self individual
            "travellerNameEnglish": "1111",
            "travellerNameArabic": "1111",
            "personAge": 35,
            "gender": "Male",
            "nationality": "Afghanistan",
            "passportNumber": "111111",
            "passportExpiryDate": "2025-12-01",
            "policyCoverage": []
         
        }
    ],
    "policyCustomer": {
        "nationalId": "103567890",
        "gender": "M",
        "customerNameEnglish": "1111",
        "customerNameArabic": "1111",
        "nationality": "Saudi Arabia",
        "dateOfBirth": "1999-01-02",
        "mobile": "05308666603"
    }
}