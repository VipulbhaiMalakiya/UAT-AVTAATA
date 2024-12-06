import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from './chat.reducer';

export const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectChatHistory = createSelector(
    selectChatState,
    (state: ChatState) => state.receivedData
);

export const selectIsLoading = createSelector(
    selectChatState,
    (state: ChatState) => state.isLoading
);
