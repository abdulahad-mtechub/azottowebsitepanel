import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

const documentData = [
    {
        id: 1,
        name: t('Valuation_Report_ExpertFirm.pdf'),
        size: '5.3 MB'
    },
    {
        id: 2,
        name: t('Business_Tax_Certificate_2023.jpg'),
        size: '5.3 MB'
    },
    {
        id: 3,
        name: t('Valuation_Report_ExpertFirm.pdf'),
        size: '5.3 MB'
    },
];


const useDistricts = () => {
  const { t } = useTranslation();

  const districts = [
    { id: 'riyadh', name: t('Riyadh') },
    { id: 'makkah', name: t('Makkah') },
    { id: 'madinah', name: t('Madinah') },
    { id: 'eastern-province', name: t('Eastern Province') },
    { id: 'qassim', name: t('Qassim') },
    { id: 'asir', name: t('Asir') },
    { id: 'tabuk', name: t('Tabuk') },
    { id: 'hail', name: t('Hail') },
    { id: 'northern-borders', name: t('Northern Borders') },
    { id: 'al-jouf', name: t('Al Jouf') },
    { id: 'jazan', name: t('Jazan') },
    { id: 'najran', name: t('Najran') },
    { id: 'taif', name: t('Taif') },
    { id: 'al-baha', name: t('Al Baha') },
  ];

  return districts;
};

const useCities = () => {
  const { t } = useTranslation();

  const cities = {
    riyadh: [
      { id: 'riyadh', name: t('Riyadh') },
      { id: 'al-kharj', name: t('Al Kharj') },
      { id: 'al-dawadmi', name: t('Al Dawadmi') },
      { id: 'al-majmaah', name: t('Al Majmaah') },
      { id: 'wadi-al-dawasir', name: t('Wadi Al Dawasir') },
      { id: 'az-zulfi', name: t('Az Zulfi') },
    ],
    makkah: [
      { id: 'makkah', name: t('Makkah') },
      { id: 'jeddah', name: t('Jeddah') },
      { id: 'taif', name: t('Taif') },
      { id: 'al-qunfudhah', name: t('Al Qunfudhah') },
      { id: 'rabigh', name: t('Rabigh') },
    ],
    madinah: [
      { id: 'madinah', name: t('Madinah') },
      { id: 'yanbu', name: t('Yanbu') },
      { id: 'khaybar', name: t('Khaybar') },
      { id: 'al-ula', name: t('Al Ula') },
    ],
    qassim: [
      { id: 'buraydah', name: t('Buraydah') },
      { id: 'unaizah', name: t('Unaizah') },
      { id: 'ar-rass', name: t('Ar Rass') },
      { id: 'al-bukayriyah', name: t('Al Bukayriyah') },
    ],
    'eastern-province': [
      { id: 'dammam', name: t('Dammam') },
      { id: 'khobar', name: t('Khobar') },
      { id: 'dhahran', name: t('Dhahran') },
      { id: 'jubail', name: t('Jubail') },
      { id: 'al-ahsa', name: t('Al Ahsa (Hofuf/Mubarraz)') },
      { id: 'qatif', name: t('Qatif') },
      { id: 'hafar-al-batin', name: t('Hafar Al Batin') },
      { id: 'al-khafji', name: t('Al Khafji') },
    ],
    asir: [
      { id: 'abha', name: t('Abha') },
      { id: 'khamis-mushait', name: t('Khamis Mushait') },
      { id: 'mahail-asir', name: t('Mahail Asir') },
      { id: 'bisha', name: t('Bisha') },
      { id: 'al-namas', name: t('Al Namas') },
      { id: 'sabt-al-alaya', name: t('Sabt Al Alaya') },
    ],
    tabuk: [
      { id: 'tabuk', name: t('Tabuk') },
      { id: 'al-wajh', name: t('Al Wajh') },
      { id: 'duba', name: t('Duba') },
      { id: 'haql', name: t('Haql') },
      { id: 'umluj', name: t('Umluj') },
    ],
    hail: [
      { id: 'hail', name: t('Hail') },
      { id: 'baqaa', name: t('Baqaa') },
      { id: 'al-ghazalah', name: t('Al Ghazalah') },
      { id: 'jubbah', name: t('Jubbah') },
      { id: 'ash-shinan', name: t('Ash Shinan') },
    ],
    'northern-borders': [
      { id: 'arar', name: t('Arar') },
      { id: 'rafha', name: t('Rafha') },
      { id: 'turaif', name: t('Turaif') },
    ],
    'al-jouf': [
      { id: 'sakaka', name: t('Sakaka') },
      { id: 'al-qurayyat', name: t('Al Qurayyat') },
      { id: 'dumat-al-jandal', name: t('Dumat Al Jandal') },
    ],
    jazan: [
      { id: 'jazan', name: t('Jazan') },
      { id: 'samtah', name: t('Samtah') },
      { id: 'abu-arish', name: t('Abu Arish') },
      { id: 'sabya', name: t('Sabya') },
    ],
    najran: [
      { id: 'najran', name: t('Najran') },
      { id: 'sharurah', name: t('Sharurah') },
      { id: 'hubuna', name: t('Hubuna') },
    ],
    'al-baha': [
      { id: 'al-baha', name: t('Al Baha') },
      { id: 'baljurashi', name: t('Baljurashi') },
      { id: 'al-mandaq', name: t('Al Mandaq') },
    ],
  };

  return cities;
};


export { documentData , useDistricts, useCities};
