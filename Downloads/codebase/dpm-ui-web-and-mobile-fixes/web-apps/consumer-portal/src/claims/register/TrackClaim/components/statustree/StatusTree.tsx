
import React from 'react'
import './StatusTree.scss';

export default function StatusTree() {

  const claimTrack =  'Claim Track';
  
    const claimStatuses = [
        "05/13/2024 - Claim Reported",
        "05/18/2024 - Under Review / Investigation",
        "05/27/2024 - Waiting for Surveyor Estimation",
        "05/18/2024 - Under Review / Investigation",
        "05/27/2024 - Waiting for Surveyor Estimation",
        "05/18/2024 - Under Review / Investigation",
        "05/27/2024 - Waiting for Surveyor Estimation",
        "06/02/2024 - 2 Documents uploaded",
        "05/18/2024 - Under Review / Investigation",
        "05/27/2024 - Waiting for Surveyor Estimation",
        "06/16/2024 - Pending Approval",
        "06/20/2024 - Approved (Current status of your claim)",
    ];

    const documents = [
        "Document1 (pdf)",
        "Document2 (word)",
        "Document1 (pdf)",
        "Document2 (word)",
        "Document1 (pdf)",
        "Document2 (word)",
    ];

    return (
        <div className='treeContainer'>
            <div className='pageTitle'>{claimTrack}</div>
            <ul className="mainTree">
                {claimStatuses.map((status, index) => (
                    <li key={index}>
                        {status}
                        {status.includes("Documents uploaded") && (
                            <ul className="subTree">
                                {documents.map((doc, docIndex) => (
                                    <li key={docIndex}>{doc}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}