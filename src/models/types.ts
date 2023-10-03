import type { DvaModel } from '@@/plugin-dva/types'
import { pullAt, findIndex } from 'lodash';
import { service, getTypes } from '@/services/item-types';

const ScheduleModel: DvaModel<{ types: Items.Types[] }> = {
  namespace: 'types',
  state: {
    types: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      let response = {};
      try {
        response = yield call(getTypes);
      } catch (e) {
      }

      yield put({
        type: 'setTypes',
        payload: response,
      });
    }
  },
  reducers: {
    Add(state, { payload }) {
      const types = [...(state.types || []), payload];

      return {
        ...state,
        types,
      };
    },
    Update(state, { payload }) {
      const types = [...(state.types || [])];
      const find = findIndex(types, { id: payload.id });
      if (find >= 0) {
        types[find] = payload;
        return {
          ...state,
          types,
        };
      }
      return state;
    },
    Remove(state, { payload }) {
        const types = [...(state.types || [])];
        const find = findIndex(types, { id: payload.id });
        if(find >= 0){ 
            pullAt(types, find);
            return {
                types
            }
        }
        return state;
    },
    setTypes(state, { payload }) {
      return {
        ...state,
        types: payload
      };
    },
  },
  subscriptions: {
    created({ dispatch }) {
      service.on('created', (payload: Items.Types) => {
        dispatch({
          type: 'Add',
          payload,
        });
      });
      return service.off.bind(null, 'created');
    },
    patched({ dispatch }: any) {
      service.on('patched', (payload: Items.Types) => {
        dispatch({
          type: 'Update',
          payload,
        });
      });
      return service.off.bind(null, 'patched');
    },
    removed({ dispatch }) {
      service.on('removed', (payload: Items.Types) => {
        dispatch({
          type: 'Remove',
          payload,
        });
      });
      return service.off.bind(null, 'removed');
    },
  },
};

export default ScheduleModel;
