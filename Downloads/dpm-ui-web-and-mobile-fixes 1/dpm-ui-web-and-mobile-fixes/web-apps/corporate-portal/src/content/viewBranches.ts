export const BranchData = {
  title: "View Our Branches in the Kingdom",
  description:
    "We serve our clients all over the Kingdom through 3 regional offices and more than 70 retail offices.",
  branchTypes: [
    { name: "All Offices" },
    { name: "Sales Branches" },
    { name: "Claim Centers" },
    { name: "Head Office" },
    { name: "Regional Offices" },
  ],
  regions: [{ label: "Riyadh" }, { label: "Makkah" }],
  regionsWithCities: [
    {
      regionName: "Riyadh",
      cities: [{ name: "Riyadh" }, { name: "Al-Kharj" }, { name: "Shaqra" }],
    },
    {
      regionName: "Makkah",
      cities: [{ name: "Mecca" }, { name: "Jeddah" }, { name: "Taif" }],
    },
  ],

  branchDetails: [
    {
      title: "Jeddah - Regional Office",
      location: "Prince Mohammed Bin Abdilaziz st - Tahlia Center",
      contact: { phone: "8001199222", email: "khobar@walaa.com" },
      operationHours: {
        hours: "8:00AM - 1:00PM & 2:00PM - 5:00PM",
        days: "Sunday - Thursday",
      },
      position: { lat: 21.5433, lng: 39.1728 },
    },
    {
      title: "Claim Center - Jeddah",
      location: "7524 3675 King Abdul Aziz Rd, Ash Shati, Jeddah 23412",
      contact: { phone: "8001199222", email: "walaa@walaa.com" },
      operationHours: {
        hours: "8:00AM - 1:00PM & 2:00PM - 5:00PM",
        days: "Sunday - Thursday",
      },
      position: { lat: 26.282709, lng: 50.1978613 },
    },
  ],
};
