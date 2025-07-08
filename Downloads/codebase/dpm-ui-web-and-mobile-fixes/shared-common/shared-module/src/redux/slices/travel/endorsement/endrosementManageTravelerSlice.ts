import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the Traveler type
export interface Traveler {
  id: number | string;
  name: string;
  dob: string;
  passportNo: string;
  passportExpiry: string;
  relation: string;
  coverageCode: { coverageType: string }[];
}

// Define the initial state
const initialState: { endorsementTravelers: Traveler[] } = {
  endorsementTravelers: [
    {
      id: Date.now(),
      name: "John Doe",
      dob: "1960-07-15",
      passportNo: "A1234567",
      passportExpiry: "2030-08-20",
      relation: "1",
      coverageCode: [{ coverageType: "CV" }, { coverageType: "WSC" }],
    },
    {
      id: Date.now() + 1,
      name: "Jane Doe",
      dob: "2013-09-22",
      passportNo: "B7654321",
      passportExpiry: "2029-05-10",
      relation: "4",
      coverageCode: [{ coverageType: "CV" }],
    },
    {
      id: Date.now() + 2,
      name: "Michael Doe",
      dob: "2012-03-10",
      passportNo: "C9876543",
      passportExpiry: "2028-07-15",
      relation: "3",
      coverageCode: [{ coverageType: "WSC" }],
    },
    {
      id: Date.now() + 3,
      name: "Emily Doe",
      dob: "2015-06-25",
      passportNo: "D4567890",
      passportExpiry: "2029-09-30",
      relation: "4",
      coverageCode: [{ coverageType: "CV" }, { coverageType: "WSC" }],
    },
    {
      id: Date.now() + 4,
      name: "Emily Doe Raju",
      dob: "2018-06-25",
      passportNo: "D4567890",
      passportExpiry: "2029-09-30",
      relation: "3",
      coverageCode: [{ coverageType: "WSC" }],
    },
  ],
};

const endorsementTravelersSlice = createSlice({
  name: "endorsementTravelers",
  initialState,
  reducers: {
    addEndorsementTraveler: (
      state,
      action: PayloadAction<Omit<Traveler, "id">>
    ) => {
      const exists = state.endorsementTravelers.some(
        (item) => item.passportNo === action.payload.passportNo
      );

      if (!exists) {
        const newTraveler = { id: Date.now(), ...action.payload };
        state.endorsementTravelers.push(newTraveler);
      }
    },

    updateEndorsementTraveler: (state, action: PayloadAction<Traveler>) => {
      const indexValue = state.endorsementTravelers.findIndex(
        (item) => item.id === action.payload.id
      );

      if (indexValue !== -1) {
        state.endorsementTravelers[indexValue] = {
          ...state.endorsementTravelers[indexValue],
          ...action.payload,
        };
      }
    },

    deleteEndorsementTraveler: (state, action: PayloadAction<number>) => {
      state.endorsementTravelers = state.endorsementTravelers.filter(
        (item) => item.id !== action.payload
      );
    },

    getEndorsementTravelers: (state) => state,

    addBenefits: (
      state,
      action: PayloadAction<{ travelerId: number; coverageType: string }>
    ) => {
      const traveler = state.endorsementTravelers.find(
        (item) => item.id === action.payload.travelerId
      );

      if (traveler) {
        const exists = traveler.coverageCode.some(
          (item) => item.coverageType === action.payload.coverageType
        );

        if (!exists) {
          traveler.coverageCode.push({
            coverageType: action.payload.coverageType,
          });
        }
      }
    },

    removeBenefits: (
      state,
      action: PayloadAction<{ travelerId: number; coverageType: string }>
    ) => {
      const traveler = state.endorsementTravelers.find(
        (item) => item.id === action.payload.travelerId
      );

      if (traveler) {
        traveler.coverageCode = traveler.coverageCode.filter(
          (item) => item.coverageType !== action.payload.coverageType
        );
      }
    },
  },
});

export const {
  addEndorsementTraveler,
  updateEndorsementTraveler,
  deleteEndorsementTraveler,
  getEndorsementTravelers,
  addBenefits,
  removeBenefits,
} = endorsementTravelersSlice.actions;

export default endorsementTravelersSlice.reducer;
