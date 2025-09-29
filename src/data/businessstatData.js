import { t } from 'i18next';

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

const district = [
    { id: 1, name: t('Riyadh'), value: 'riyadh' },
    { id: 2, name: t('Jeddah'), value: 'jeddah' },
    { id: 3, name: t('Dammam'), value: 'dammam' },
    { id: 4, name: t('Khobar'), value: 'khobar' },
    { id: 5, name: t('Makkah'), value: 'makkah' },
    { id: 6, name: t('Medina'), value: 'medina' },
    { id: 7, name: t('Taif'), value: 'taif' },
    { id: 8, name: t('Tabuk'), value: 'tabuk' },
    { id: 9, name: t('Hail'), value: 'hail' },
    { id: 10, name: t('Najran'), value: 'najran' }
];

const cities = {
    riyadh: [
      { id: 1, name: t('Riyadh'), value: 'riyadh' },
      { id: 2, name: t('Al Kharj'), value: 'al-kharj' },
      { id: 3, name: t("Al Majma'ah"), value: 'al-majmaah' },
    ],
    jeddah: [
      { id: 4, name: t('Jeddah'), value: 'jeddah' },
      { id: 5, name: t('Rabigh'), value: 'rabigh' },
    ],
    dammam: [
      { id: 6, name: t('Dammam'), value: 'dammam' },
      { id: 7, name: t('Dhahran'), value: 'dhahran' },
      { id: 8, name: t('Qatif'), value: 'qatif' },
    ],
    khobar: [
      { id: 9, name: t('Khobar'), value: 'khobar' },
    ],
    makkah: [
      { id: 10, name: t('Makkah'), value: 'makkah' },
      { id: 11, name: t('Jumum'), value: 'jumum' },
    ],
    medina: [
      { id: 12, name: t('Medina'), value: 'medina' },
      { id: 13, name: t('Yanbu'), value: 'yanbu' },
    ],
    tabuk: [
      { id: 14, name: t('Tabuk'), value: 'tabuk' },
      { id: 15, name: t('Duba'), value: 'duba' },
    ],
    taif: [
      { id: 16, name: t('Taif'), value: 'taif' },
    ],
    hail: [
      { id: 17, name: t('Hail'), value: 'hail' },
    ],
    najran: [
      { id: 18, name: t('Najran'), value: 'najran' },
    ],
};

export { documentData, district, cities };
