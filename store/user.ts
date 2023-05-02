import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from './../interface/index';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: '',
        fname: '',
        lname: '',
        email: '',
        role: '',
        bio: '',
        country: '',
        phone: '',
        postal_code: '',
        street_address: '',
        city: '',
        state: '',
        website: '',
        pv: 0,
    } as IUser,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.id = action.payload.id;
            state.fname = action.payload.fname;
            state.lname = action.payload.lname;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.bio = action.payload.bio;
            state.country = action.payload?.country;
            state.city = action.payload?.city;
            state.street_address = action.payload?.street_address;
            state.postal_code = action.payload?.postal_code;
            state.phone = action.payload?.phone;
            state.website = action.payload?.website;
            state.state = action.payload?.state;
            state.pv = action.payload?.pv;
        },
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
