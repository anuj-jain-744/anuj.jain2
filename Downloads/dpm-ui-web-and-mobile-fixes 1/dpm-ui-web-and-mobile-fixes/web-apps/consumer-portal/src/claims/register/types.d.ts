interface IRegisterNewClaim {
  src: string,
  alt: string,
  className: string,
  titleclassName: string,
  title: string
  cardclassName: string
}

type CaseReferenceNum = {
  name: string;
  value: string;
};

type OwnerId = {
  name: string;
  value: string;
};


type TypeRegisterFormData = {
  caseReferencenum: CaseReferenceNum;
  ownerId: OwnerId;
};
