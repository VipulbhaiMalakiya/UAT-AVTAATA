// contact.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { setCurrentContact, setMessageStatus } from './contact.actions';

export interface ContactState {
    currentContact: string | null;
}

export const initialState: ContactState = {
    currentContact: null
};

export const contactReducer = createReducer(
    initialState,
    on(setCurrentContact, (state, { contact }) => ({ ...state, currentContact: contact })),
    on(setMessageStatus, (state, { contact, isSeen }) => {
        // You could modify the state based on whether the message is seen or not
        return state;
    })
);
