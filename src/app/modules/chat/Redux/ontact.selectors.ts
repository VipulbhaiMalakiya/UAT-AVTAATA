// contact.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ContactState } from './contact.reducer';

export const selectContactState = createFeatureSelector<ContactState>('contact');

export const selectCurrentContact = createSelector(
    selectContactState,
    (state: ContactState) => state.currentContact
);


