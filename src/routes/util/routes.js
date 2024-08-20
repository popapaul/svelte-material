
import {
  mdiSpeedometerMedium,
  mdiSpeedometer,
  mdiPaletteOutline,
  mdiPalette,
  mdiViewDashboardOutline,
  mdiViewDashboard,
  mdiFunction,
  mdiFunctionVariant,
  mdiFlaskEmptyOutline,
  mdiFlaskOutline,
} from '@mdi/js';

export default [
  {
    text: 'Getting Started',
    icon: mdiSpeedometerMedium,
    openIcon: mdiSpeedometer,
    items: [
      { text: 'Installation', href: '/getting-started/installation/' },
      { text: 'Usage', href: '/getting-started/usage/' },
      { text: 'Contributing', href: '/getting-started/contributing/' },
    ],
  },
  {
    text: 'Components',
    icon: mdiViewDashboardOutline,
    openIcon: mdiViewDashboard,
    items: [
      { text: 'Material App', href: '/components/material-app/' },
      { text: 'Alerts', href: '/components/alerts/' },
      { text: 'App Bar', href: '/components/app-bar/' },
      { text: 'Avatars', href: '/components/avatars/' },
      { text: 'Breadcrumbs', href: '/components/breadcrumbs/' },
      { text: 'Buttons', href: '/components/buttons/' },
      { text: 'Badges', href: '/components/badges/' },
      {
        text: 'Groups',
        items: [
          { text: 'Button Groups', href: '/components/button-groups/' },
          { text: 'List item Groups', href: '/components/list-item-groups/' },
          { text: 'Slide Groups', href: '/components/slide-groups/' },
          { text: 'Windows', href: '/components/windows/' },
        ],
      },
      { text: 'Tabs', href: '/components/tabs/' },
      { text: 'Cards', href: '/components/cards/' },
      { text: 'Chips', href: '/components/chips/' },
      { text: 'DataTable', href: '/components/data-table/' },
      { text: 'Dialog', href: '/components/dialog/' },
      { text: 'Dividers', href: '/components/dividers/' },
      { text: 'Grid', href: '/components/grid/' },
      { text: 'Icons', href: '/components/icons/' },
      { text: 'Expansion Panels', href: '/components/expansion-panels/' },
      { text: 'Footer', href: '/components/footer/' },
      {
        text: 'Forms',
        items: [
          { text: 'Text Field', href: '/components/text-field/' },
          { text: 'Textarea', href: '/components/textarea/' },
          { text: 'Selects', href: '/components/selects/' },
          { text: 'Sliders', href: '/components/sliders/' },
          { text: 'Checkboxes', href: '/components/checkboxes/' },
          { text: 'Switches', href: '/components/switches/' },
          { text: 'Radio', href: '/components/radio/' },
        ],
      },
      { text: 'Lists', href: '/components/lists/' },
      { text: 'Virtual Lists', href: '/components/virtual-lists/' },
      { text: 'Menus', href: '/components/menus/' },
      { text: 'Navigation Drawer', href: '/components/navigation-drawer/' },
      { text: 'Overlay', href: '/components/overlay/' },
      {
        text: 'Progress',
        items: [
          { text: 'Circular', href: '/components/progress-circular/' },
          { text: 'Linear', href: '/components/progress-linear/' },
        ],
      },
      { text: 'Snackbars', href: '/components/snackbars/' },
      { text: 'Subheader', href: '/components/subheader/' },
      { text: 'Tooltips', href: '/components/tooltips/' },
    ],
  },
  {
    text: 'Actions',
    icon: mdiFunction,
    openIcon: mdiFunctionVariant,
    items: [
      { text: 'Ripple', href: '/actions/ripple/' },
      { text: 'Click outside', href: '/actions/click-outside/' },
      { text: 'Intersection observer', href: '/actions/intersect/' },
      { text: 'Jump', href: '/actions/jump/' },
      { text: 'Touch', href: '/actions/touch/' },
    ],
  }
];
