import { getDriverIdentifier } from "./driverIdentifier";

describe("getDriverIdentifier", () => {
  const mockLanguageData = {
    national_id: "National ID",
    iqama_no: "Iqama Number",
  };

  it("should return national_id when driverID starts with '1'", () => {
    const driverID = "12345";
    const result = getDriverIdentifier(driverID, mockLanguageData);
    expect(result).toBe("National ID");
  });

  it("should return iqama_no when driverID starts with '2'", () => {
    const driverID = "23456";
    const result = getDriverIdentifier(driverID, mockLanguageData);
    expect(result).toBe("Iqama Number");
  });

  it("should return null when driverID does not start with '1' or '2'", () => {
    const driverID = "34567";
    const result = getDriverIdentifier(driverID, mockLanguageData);
    expect(result).toBeNull();
  });

  it("should return null when driverID is undefined", () => {
    const driverID = undefined;
    const result = getDriverIdentifier(driverID, mockLanguageData);
    expect(result).toBeNull();
  });

  it("should handle missing languageData gracefully", () => {
    const driverID = "12345";
    const result = getDriverIdentifier(driverID, undefined);
    expect(result).toBeUndefined();
  });
});