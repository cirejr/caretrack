export const GenderOptions = ["Male", "Female"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const Specialties = [
  { name: "Cardiology", value: "cardiology" },
  { name: "Dermatology", value: "dermatology" },
  { name: "Endocrinology", value: "endocrinology" },
  { name: "Gastroenterology", value: "gastroenterology" },
  { name: "Hematology", value: "hematology" },
  { name: "Immunology", value: "immunology" },
  { name: "Nephrology", value: "nephrology" },
  { name: "Neurology", value: "neurology" },
  { name: "Oncology", value: "oncology" },
  { name: "Ophthalmology", value: "ophthalmology" },
  { name: "Orthopedics", value: "orthopedics" },
  { name: "Otolaryngology", value: "otolaryngology" },
  { name: "Pediatrics", value: "pediatrics" },
  { name: "Psychiatry", value: "psychiatry" },
  { name: "Pulmonology", value: "pulmonology" },
  { name: "Radiology", value: "radiology" },
  { name: "Rheumatology", value: "rheumatology" },
  { name: "Surgery", value: "surgery" },
  { name: "Urology", value: "urology" },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
