import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import ShowResult, { resultObj } from "../ShowResult";


describe("ShowResult Component", () => {
  it("renders correctly with given all props", () => {
    const noResultPlacehoder = { noResultTitle: "No Result Found", noResultSubTitle: "Test Data" };
    const resultData = [{
      title: "Test",
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
      link: ""
    }, {
      title: "Test1",
      body: "test Body1",
      link: ""
    }];
    render(
      <ShowResult 
        resultData={resultData} 
        noResultPlacehoder={noResultPlacehoder}      
      />
    );
    resultData.forEach((item) => {
      expect(screen.getByText(item?.title)).toBeInTheDocument();
      expect(screen.getByText(item.body.length < 150 ? item.body : `${item.body.slice(0, 150)}...`)).toBeInTheDocument();        
    });
  });

  it("renders correctly with given all empty results", () => {
    const noResultPlacehoder = { noResultTitle: "No Result Found", noResultSubTitle: "Test Data" };
    const resultData = [] as resultObj[];
    render(
      <ShowResult 
        resultData={resultData} 
        noResultPlacehoder={noResultPlacehoder}      
      />
    );
    const title = screen.getByText(noResultPlacehoder?.noResultTitle);
    const subTitle = screen.getByText(noResultPlacehoder?.noResultSubTitle);
    expect(title).toBeInTheDocument();
    expect(subTitle).toBeInTheDocument();
  });
});
