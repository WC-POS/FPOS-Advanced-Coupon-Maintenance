import ACMStore, { ACMState } from './acm';
import FPOSStore, { FPOSState } from './fpos';
import create, { GetState, SetState } from 'zustand';

import { StoreApiWithSubscribeWithSelector } from 'zustand/middleware';

export const useACMStore = create<
  ACMState,
  SetState<ACMState>,
  GetState<ACMState>,
  StoreApiWithSubscribeWithSelector<ACMState>
>(ACMStore);

export const useFPOSStore = create<
  FPOSState,
  SetState<FPOSState>,
  GetState<FPOSState>,
  StoreApiWithSubscribeWithSelector<FPOSState>
>(FPOSStore);
