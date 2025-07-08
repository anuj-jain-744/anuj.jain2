import { useState, useEffect, Fragment } from "react";
import { Dropdown, DropdownButton, Container } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NoResultFound from "components/SearchInfoByKeyword/NoResult";
import { MultiLayoutCard } from "components/MultiLayoutCard";
import { LORProps } from "./listOfReports.types";
import "./index.scss";

export const ListOfReports: React.FC<LORProps> = ({
  commonKeywords,
  financialYears,
  reportData,
  navigateTo,
}) => {
  const { list_of_reports, no_results_found, no_result_found_description } =
    commonKeywords;

  const [reportSelection, setReportSelection] = useState({
    financialYear: new Date().getFullYear().toString(),
  });

  const [reportResult, setReportResult] = useState<
    { label: string; url: string }[]
  >([]);

  const handleFilterSelection = (field: string, value: string) => {
    const updatedSelection = { ...reportSelection, [field]: value };
    setReportSelection(updatedSelection);

    const { financialYear } = updatedSelection;
    setReportResult(yearToReportMapping(financialYear));
  };

  const yearToReportMapping = (year?: string, type?: string) => {
    const filteredReports = reportData.filter((report) => {
      return (
        (!year || report.financial_year === year) &&
        (!type || report.report_type === type)
      );
    });

    return filteredReports.map(({ report_type, file_name, file_url }) => ({
      label: `${report_type} - ${file_name}`,
      url: file_url,
    }));
  };

  useEffect(() => {
    setReportResult(yearToReportMapping(reportSelection.financialYear));
  }, [reportSelection.financialYear, reportData]);

  const noResult = {
    noResultTitle: no_results_found,
    noResultSubTitle: no_result_found_description,
  };

  return (
    <section className="lor-section">
      <Container fluid>
        <div className="header-wrapper d-flex">
          <div className="title-wrapper">
            <h1 className="walaa-medium-500">{list_of_reports}</h1>
          </div>
          <div className="dropdown-wrapper d-flex">
            <DropdownButton
              title={
                <div className="d-flex dropdown-title">
                  <span>{reportSelection.financialYear}</span>
                  <ExpandMoreIcon />
                </div>
              }
            >
              {financialYears.map((year, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleFilterSelection("financialYear", year)}
                  className={
                    reportSelection.financialYear === year ? "selected" : ""
                  }
                >
                  {year}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
        </div>

        <div className="result-wrapper">
          {reportResult.length > 0 ? (
            <Fragment>
              {reportResult.map(({ label, url }, index) => (
                <MultiLayoutCard
                  layout="list"
                  label={label}
                  link={url}
                  navigateTo={navigateTo}
                  key={index}
                />
              ))}
            </Fragment>
          ) : (
            <NoResultFound noResultPlacehoder={noResult} />
          )}
        </div>
      </Container>
    </section>
  );
};
