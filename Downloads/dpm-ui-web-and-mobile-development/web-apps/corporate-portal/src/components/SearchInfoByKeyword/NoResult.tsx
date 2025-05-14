import NoResult from "../../assets/Search/noResults.png";

interface NoResultFoundProps {
    noResultPlacehoder: {
        noResultTitle: string;
        noResultSubTitle: string;
      }
}
const NoResultFound = ({noResultPlacehoder} : NoResultFoundProps) => {
    return (
        <div className="no-result-found">
            <img src={NoResult} />
            <h1 className="walaa-medium-500">{noResultPlacehoder?.noResultTitle}</h1>
            <span>{noResultPlacehoder?.noResultSubTitle}</span>
        </div>
    )
}

export default NoResultFound;