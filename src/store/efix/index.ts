import { createSlice } from '@reduxjs/toolkit';
import { Asset } from 'react-native-image-picker';

const slice = createSlice({
  name: 'efix',
  initialState: { image: null, metadata: null } as EfixState,
  reducers: {
    setImage: (state, { payload: { image } }: EfixPayload) => {
      if (typeof image !== 'undefined') {
        state.image = image;
      }
    },
    setMetadata: (state, { payload: { metadata } }: EfixPayload) => {
      if (typeof metadata !== 'undefined') {
        state.metadata = metadata;
      }
    },
  },
});

export const { setImage, setMetadata } = slice.actions;

export default slice.reducer;

export type EfixState = {
  image: Asset | null;
  metadata: any | null;
};

type EfixPayload = {
  payload: Partial<EfixState>;
};
