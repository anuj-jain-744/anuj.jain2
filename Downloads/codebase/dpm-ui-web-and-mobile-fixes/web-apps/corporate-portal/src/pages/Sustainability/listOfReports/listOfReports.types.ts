interface Report {
    financial_year: string;
    report_type: string;
    file_name: string;
    file_url: string;
  }
  
  interface CommonKeywordProps {
    list_of_reports: string;
    no_results_found: string;
    no_result_found_description: string;
  }
  
  export interface LORProps {
    financialYears: string[];
    reportData: Report[];
    commonKeywords: CommonKeywordProps;
    navigateTo: (url: string) => void;
  }