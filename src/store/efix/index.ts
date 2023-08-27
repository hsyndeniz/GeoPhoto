import { createSlice } from '@reduxjs/toolkit';
import { Asset } from 'react-native-image-picker';

const slice = createSlice({
  name: 'efix',
  initialState: { image: null } as EfixState,
  reducers: {
    setImage: (state, { payload: { image } }: EfixPayload) => {
      if (typeof image !== 'undefined') {
        state.image = image;
      }
    },
  },
});

export const { setImage } = slice.actions;

export default slice.reducer;

export type EfixState = {
  image: Asset | null;
};

type EfixPayload = {
  payload: Partial<EfixState>;
};
