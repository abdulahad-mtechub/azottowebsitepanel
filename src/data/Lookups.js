const teamsizeOp = [
    {
        id: 1,
        name: '1-10'
    },
    {
        id: 2,
        name: '10-20'
    },
    {
        id: 3,
        name: '20-50'
    },
    {
        id: 4,
        name: '50-100'
    },
    {
        id: 5,
        name: '100-200'
    },
    {
        id: 6,
        name: '200+'
    }
]

const revenueLookups = [
    {
        id: 1,
        name: 'Last 6 Months'
    },
    {
        id: 2,
        name: 'Last Year'
    },
]

const yearOp = [
    {
        id: 1,
        name: '2020'
    },
    {
        id: 2,
        name: '2021'
    },
    {
        id: 3,
        name: '2022'
    },
    {
        id: 4,
        name: '2023'
    },
    {
        id: 5,
        name: '2024'
    },
    {
        id: 6,
        name: '2025'
    },
]

const districtOp = [
    { id: 1, name: 'Riyadh', value: 'riyadh' },
    { id: 2, name: 'Makkah', value: 'makkah' },
    { id: 3, name: 'Eastern', value: 'dammam' },
    { id: 4, name: 'Al-Madinah', value: 'medina' },
    { id: 5, name: 'Asir', value: 'abha' },
    { id: 6, name: 'Tabuk', value: 'tabuk' },
    { id: 7, name: 'Hail', value: 'hail' },
    { id: 8, name: 'Al-Jouf', value: 'sakaka' },
    { id: 9, name: 'Al-Bahah', value: 'al-bahah' },
    { id: 10, name: 'Jazan', value: 'jazan' },
    { id: 11, name: 'Najran', value: 'najran' },
    { id: 12, name: 'Northern Borders', value: 'ar-ar' },
    { id: 13, name: 'Al-Qassim', value: 'buraidah' },
  ];
  

const multipleOp = [
    {
        id: 1,
        name: '1x'
    },
    {
        id: 2,
        name: '2x'
    },
    {
        id: 3,
        name: '3x'
    },
    {
        id: 4,
        name: '4x'
    },
    {
        id: 5,
        name: '5x+'
    },
] 

const teamsizeFilter = [
  { label: '1-10', value: '1-10',},
  { label: '10-50', value: '10-50',},
  { label: '50-100', value: '50-100'},
  { label: '100-200', value: '100-200'},
  { label: '200+', value: '200+'},
];

const yearOper = [
  { label: '0-1', value: '0-1',},
  { label: '1-3', value: '1-3',},
  { label: '3-5', value: '3-5'},
  { label: '5-10', value: '5-10'},
  { label: '10+', value: '10+'},
];
export { teamsizeOp, revenueLookups, yearOp, districtOp, multipleOp, teamsizeFilter,yearOper }