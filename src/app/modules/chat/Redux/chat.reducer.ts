// chat.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { loadChatHistorySuccess, loadChatHistoryFailure } from './contact.actions';

export interface ChatState {
    receivedData: any[];
    isLoading: boolean;
    error: string | null;
}

export const initialState: ChatState = {
    receivedData: [],
    isLoading: false,
    error: null
};

export const chatReducer = createReducer(
    initialState,
    on(loadChatHistorySuccess, (state, { data }) => ({
        ...state,
        receivedData: data,
        isLoading: false
    })),
    on(loadChatHistoryFailure, (state, { error }) => ({
        ...state,
        error,
        isLoading: false
    }))
);
