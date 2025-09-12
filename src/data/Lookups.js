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
export { teamsizeOp, revenueLookups, teamsizeFilter,yearOper }