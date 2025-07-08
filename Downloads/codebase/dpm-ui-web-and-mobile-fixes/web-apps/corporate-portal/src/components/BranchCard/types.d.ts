export interface BranchCardProps {
    children: ReactNode;
    activeCard?: boolean;
    theme?: string;
  }
  
export interface CardTextProps {
    text: string;
    className: string;
  }
  
export interface ContactNoProps {
    phone: string;
    contentCustomClass?: string;
  }

  export interface DayData {
    day: string;
    workingHour: string;
  }
  
export interface EmailProps {
    email: string;
    contentCustomClass?: string;
  }
  
  export interface WorkingHourProps {
    label?: string;
    presetDayData?: DayData[];
    completeDaydata?: DayData[];
  }
  
export interface WorkingDayProps {
    working_days: string;
    label?: string;
  }