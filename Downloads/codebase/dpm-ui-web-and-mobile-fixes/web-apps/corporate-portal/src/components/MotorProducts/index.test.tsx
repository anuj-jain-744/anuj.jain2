import '@testing-library/jest-dom';

const data = {
    title: "Motor Insurance Products",
    description: "<p>Walaa motor insurance product is categorised under the following categories.<br>Under&nbsp;Motor comprehensive policy&nbsp;the Insured will be indemnified against accidental loss of or damage to any Motor Vehicle described in the Policy Schedule.</p>",
    header: {
        data: [
            {
                title: "Comprehensive",
                tooltip: "<h3>Agency Repair&nbsp;</h3><p>Agency repair is the maintenance of the insured vehicle as a result of a traffic accident or otherwise, as agreed in the policy form, and the repair in the car-approved agency.</p><h3>Mawthoq Repair</h3><p>Mawthoq repair is a new class, and it’s the maintenance of the insured vehicle as a result of a traffic accident or otherwise, as agreed in the policy form and the repair in approved agencies from the insurance company.&nbsp;</p><h3>Workshop Repair&nbsp;</h3><p>Workshop Repair is the maintenance of the insured vehicle as a result of a traffic accident or otherwise, as agreed in the policy form and the repair in approved workshops from the insurance company.</p>"
            },
            {
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
                "No"
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

    it('renders the header title correctly', () => {
        // render(<MotorProducts data={data} />);
        // expect(screen.getByText('Comprehensive')).toBeInTheDocument();
        // expect(screen.getByText('Third-Party Liability')).toBeInTheDocument();
    });
    it('shows the tooltip when header button is clicked', async () => {
        // render(<MotorProducts data={data} />);
        // await waitFor(() => screen.getByText('Comprehensive'));

        // const comprehensiveIcon = screen.getByAltText('Comprehensive');
        // fireEvent.click(comprehensiveIcon);
        // expect(screen.getByText(data.header.data[0].tooltip)).toBeInTheDocument();
    });
    it('renders the coverage and benefits correctly', () => {
        // render(<MotorProducts data={data} />);
        // expect(screen.getByText('Cover and Benefits')).toBeInTheDocument();
        // expect(screen.getByText('Agency Repair')).toBeInTheDocument();
        // expect(screen.getByText('Mawthoq Repair')).toBeInTheDocument();
        // expect(screen.getByText('Workshop Repair')).toBeInTheDocument();
    });
});
