import { LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions<object> = {
  prefixes: ['apaz://', 'https://apaz.app'],
  config: {
    screens: {
      Home: {
        screens: {
          HomeMain: '',
          ListingDetail: 'listing/:propertyId',
          Search: 'search',
          Favorites: 'favorites',
        },
      },
      Map: {
        screens: {
          MapMain: 'map',
          ListingDetail: 'listing/:propertyId',
        },
      },
      Profile: {
        screens: {
          ProfileMain: 'profile',
          Settings: 'settings',
          Notifications: 'notifications',
        },
      },
    },
  },
};

export default linking;

