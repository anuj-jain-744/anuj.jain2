import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ResponsiveMotorProduct } from "./responsiveMotorProduct";

const data = {
    title: "Motor Insurance Products",
    description: "<p>Walaa motor insurance product is categorised under the following categories.<br>Under&nbsp;Motor comprehensive policy&nbsp;the Insured will be indemnified against accidental loss of or damage to any Motor Vehicle described in the Policy Schedule.</p>",
    header: {
        data: [
            {
                key: "comprehensive",
                title: "Comprehensive",
                tooltip: "<h3>Agency Repair&nbsp;</h3><p>Agency repair is the maintenance of the insured vehicle as a result of a traffic accident or otherwise, as agreed in the policy form, and the repair in the car-approved agency.</p><h3>Mawthoq Repair</h3><p>Mawthoq repair is a new class, and it’s the maintenance of the insured vehicle as a result of a traffic accident or otherwise, as agreed in the policy form and the repair in approved agencies from the insurance company.&nbsp;</p><h3>Workshop Repair&nbsp;</h3><p>Workshop Repair is the maintenance of the insured vehicle as a result of a traffic accident or otherwise, as agreed in the policy form and the repair in approved workshops from the insurance company.</p>"
            },
            {
                key: "thirdparty",
                title: "Third-Party Liability",
                tooltip: "<p>Under this the insured is covered against, any third-party bodily injury caused to the third party inside or outside the vehicle and material damage to the outside of the third-party vehicle. TPL insurance for your vehicle is required in KSA.</p>"
            }
        ]
    },
    legends: {
        title: "Legends",
        data: [
            {
                title: "Included in coverage",
                icons: "yes"
            },
            {
                title: "Excluded in coverage",
                icons: "no"
            },
            {
                title: "Add-ons benefits",
                icons: "Addon"
            }
        ]
    },
    prodmatrix: [
        {
            benefits: [
                "Cover and Benefits"
            ],
            comprehensive: [
                "Agency Repair",
                "Mawthoq Repair",
                "Workshop Repair"
            ],
            thirdparty: []
        },
        {
            benefits: [
                "Cover against Loss/Damage to own Vehicle"
            ],
            comprehensive: [
                "Yes",
                "No",
                "No"
            ],
            thirdparty: [
                "No"
            ]
        },
        {
            benefits: [
                "Third Party Liability upto 10m SR"
            ],
            comprehensive: [
                "Yes",
                "Yes",
                "Yes"
            ],
            thirdparty: [
                "Yes"
            ]
        },
        {
            benefits: [
                "Emergency Medical Expenses"
            ],
            comprehensive: [
                "Yes",
                "No",
                "No"
            ],
            thirdparty: [
                "No"
            ]
        },
        {
            benefits: [
                "Theft"
            ],
            comprehensive: [
                "Yes",
                "No",
                "No"
            ],
            thirdparty: [
                "No"
            ]
        },
        {
            benefits: [
                "No Claims Discount"
            ],
            comprehensive: [
                "Yes",
                "No",
                "test"
            ],
            thirdparty: [
                "No"
            ]
        },
        {
            benefits: [
                "Loyalty Discount"
            ],
            comprehensive: [
                "Yes",
                "Yes",
                "Yes"
            ],
            thirdparty: [
                "Yes"
            ]
        },
        {
            benefits: [
                "Personal Accident (Passengers)"
            ],
            comprehensive: [
                "Yes",
                "Yes",
                "Yes"
            ],
            thirdparty: [
                "Yes"
            ]
        },
        {
            benefits: [
                "Personal Accident (Driver)"
            ],
            comprehensive: [
                "Yes",
                "Addon",
                "Addon"
            ],
            thirdparty: [
                "Addon"
            ]
        },
        {
            benefits: [
                "Roadside Assistance"
            ],
            comprehensive: [
                "Yes",
                "Addon",
                "Addon"
            ],
            thirdparty: [
                "No"
            ]
        },
        {
            benefits: [
                "Natural Perils (Flood, Hail)"
            ],
            comprehensive: [
                "Yes",
                "Addon",
                "Addon"
            ],
            thirdparty: [
                "No"
            ]
        },
        {
            benefits: [
                "Windscreen Cover"
            ],
            comprehensive: [
                "Yes",
                "Addon",
                "Addon"
            ],
            thirdparty: [
                "No"
            ]
        }
    ]
};

describe('Motor insurance products component', () => {

    it('renders the header title correctly in mobile view', () => {
        render(<ResponsiveMotorProduct data={data} mobileView={true} tabletView={false} />);
        expect(screen.getByText('Comprehensive')).toBeInTheDocument();
        expect(screen.getByText('Third-Party Liability')).toBeInTheDocument();
        const proTgle = screen.getByTestId('product-toggle-0');
        expect(proTgle).toBeInTheDocument();
        fireEvent.click(proTgle);

        const proTgle1 = screen.getByTestId('product-toggle-1');
        expect(proTgle1).toBeInTheDocument();
        fireEvent.click(proTgle1);


    });

    it('renders the Comprehensive headings correctly in mobile view', () => {
        render(<ResponsiveMotorProduct data={data} mobileView={true} tabletView={false} />);

        const compreButton = screen.getByText('Comprehensive');
        expect(compreButton).toBeInTheDocument();
        fireEvent.click(compreButton);

        const agencyHeading = screen.getByText('Agency Repair');
        expect(agencyHeading).toBeInTheDocument();
        fireEvent.click(agencyHeading);
    });

    it('Prev Button Works perfectly in mobile view ', () => {
        render(<ResponsiveMotorProduct data={data} mobileView={true} tabletView={false} />);

        const prevbutton = screen.getAllByRole('button')[0];
        const nxtbutton = screen.getAllByRole('button')[1];

        expect(prevbutton).toBeDisabled();

        fireEvent.click(nxtbutton);
        fireEvent.click(nxtbutton);

        expect(prevbutton).toBeEnabled();

        fireEvent.click(prevbutton);
        expect(prevbutton).toBeEnabled();

    });


    it('next Button Works perfectly', () => {
        render(<ResponsiveMotorProduct data={data} mobileView={true} tabletView={false} />);

        const prevbutton = screen.getAllByRole('button')[0];
        const nxtbutton = screen.getAllByRole('button')[1];

        expect(nxtbutton).toBeEnabled();

        fireEvent.click(nxtbutton);
        fireEvent.click(nxtbutton);

        expect(nxtbutton).toBeDisabled();

        fireEvent.click(prevbutton);
        expect(nxtbutton).toBeEnabled();

    });


    it('renders the coverage and benefits correctly in mobile view', () => {
        render(<ResponsiveMotorProduct data={data} mobileView={true} tabletView={false} />);
        expect(screen.getByText('Cover and Benefits')).toBeInTheDocument();
        expect(screen.getByText('Agency Repair')).toBeInTheDocument();
    });
    it('renders the Comprehensive headings correctly in tablet view', () => {
        render(<ResponsiveMotorProduct data={data} mobileView={false} tabletView={true} />);

        const compreButton = screen.getByText('Comprehensive');
        expect(compreButton).toBeInTheDocument();
        fireEvent.click(compreButton);

        const agencyHeading = screen.getByText('Agency Repair');
        expect(agencyHeading).toBeInTheDocument();
        fireEvent.click(agencyHeading);

        const mothHeading = screen.getByText('Mawthoq Repair');
        expect(mothHeading).toBeInTheDocument();
        fireEvent.click(mothHeading);

        const workHeading = screen.getByText('Workshop Repair');
        expect(workHeading).toBeInTheDocument();
        fireEvent.click(workHeading);

    });
    it('renders the header title correctly in tablet view', () => {
        render(<ResponsiveMotorProduct data={data} mobileView={false} tabletView={true} />);
        expect(screen.getByText('Comprehensive')).toBeInTheDocument();
        expect(screen.getByText('Third-Party Liability')).toBeInTheDocument();
        const proTgle = screen.getByTestId('product-toggle-0');
        expect(proTgle).toBeInTheDocument();
        fireEvent.click(proTgle);

        const proTgle1 = screen.getByTestId('product-toggle-1');
        expect(proTgle1).toBeInTheDocument();
        fireEvent.click(proTgle1);


    });
});
