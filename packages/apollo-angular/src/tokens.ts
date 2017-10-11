import { InjectionToken } from '@angular/core';

import { ClientMapWrapper, ClientMap } from './types';

export const CLIENT_MAP_WRAPPER = new InjectionToken<ClientMapWrapper>('apollo/client-map-wrapper');
export const CLIENT_MAP = new InjectionToken<ClientMap>('apollo/client-map');
