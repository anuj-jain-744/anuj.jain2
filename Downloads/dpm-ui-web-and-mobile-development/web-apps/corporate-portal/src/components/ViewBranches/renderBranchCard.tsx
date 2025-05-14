import {
  getCurrentDay,
  transformData,
  getWorkingHoursForDay,
} from "utils/formatOpeningHours";
import BranchCard from "../BranchCard";

interface CommonLabels {
  working_hours_label?: string;
  workschedule_label?: string;
}

export const renderBranchCard = (
  title: string,
  address: string,
  phone: string,
  email: string | undefined,
  working_hours: string,
  working_days: string,
  working_hours_data: string,
  bIndex: number,
  commonLabels: CommonLabels,
  activeCardIndex: number,
  handleCardClick: (index: number) => void
) => {
  const presentDay = getCurrentDay();
  let jsonData;
  try {
    jsonData = JSON.parse(working_hours_data);
  } catch (error) {
    console.error("Error parsing working_hours_data:", error);
    jsonData = {};
  }
  const completeDayData = transformData(jsonData);
  const presetDayData = getWorkingHoursForDay(completeDayData, presentDay);

  return (
    <div
      key={bIndex}
      className="card-wrapper"
      onClick={() => handleCardClick(bIndex)}
    >
      <BranchCard activeCard={activeCardIndex === bIndex}>
        <BranchCard.Title title={title} />
        <BranchCard.Address address={address} />
        <div className="contact-wrapper">
          <BranchCard.ContactNo phone={phone} />
          {email && <BranchCard.Email email={email} />}
        </div>
        <BranchCard.WorkingHour
          label={commonLabels?.working_hours_label}
          completeDaydata={completeDayData}
          presetDayData={presetDayData}
        />
        <BranchCard.WorkingDay
          working_days={working_days}
          label={commonLabels?.workschedule_label}
        />
      </BranchCard>
    </div>
  );
};
