import { LayerSource } from '@tamu-gisc/common/types';
import { BasePopupComponent } from '@tamu-gisc/maps/feature/popup';

export const environment = {
  production: true
};

export const api_url = 'https://nodes.geoservices.tamu.edu/api/cpa/';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

const commonLayerProps = {
  minScale: 10000000,
  maxScale: 0
};

export const SearchSources = [];

export const LayerSources: LayerSource[] = [
  {
    type: 'feature',
    id: 'county-boundary',
    title: 'County',
    url: 'https://texasatlas.arch.tamu.edu/arcgis/rest/services/PubTX/TA_AdminBdys/MapServer/7',
    native: {
      ...commonLayerProps,
      definitionExpression: 'GEOID = 48489',
      renderer: {
        type: 'simple',
        symbol: {
          type: 'simple-line',
          color: 'red',
          style: 'short-dash',
          join: 'round',
          cap: 'round',
          width: '2pt'
        }
      }
    }
  },
  {
    type: 'graphic',
    id: 'drawing-layer',
    title: 'Drawn Features',
    native: {
      ...commonLayerProps
    }
  }
];

export const NotificationEvents = [];
