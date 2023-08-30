import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Main',
    isTitle: true
  },
  // {
  //   label: 'Gold Loans',
  //   icon: 'box',
  //   link: 'goldloans'
  // },
  {
    label: 'Loan Schemes',
    icon: 'home',
    link: 'scheme'
  },
  {
    label: 'Product Master',
    icon: 'home',
    link: 'product-master/products'
  },
  {
    label: 'Charge Definition',
    icon: 'home',
    link: '/master/charge-master'
  },
  {
    label: 'Interest Definition',
    icon: 'home',
    link: '/master/interest-view'
  },
  // {
  //   label: 'Limit Definition',
  //   icon: 'home',
  //   link: '/master/Limit-view'
  // },
  {
    label: 'Scheme Override',
    icon: 'home',
    link: 'scheme-override/override'
  },
  {
    label: 'Branch Limit',
    icon: 'home',
    link: '/master/scheme-branch-limit'
  },

  // {
  //   label: 'Office Account',
  //   icon: 'home',
  //   link: 'scheme/schemeform/OfficeAccount'
  // }

];
