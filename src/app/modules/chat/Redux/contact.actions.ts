// contact.actions.ts
import { createAction, props } from '@ngrx/store';

export const setCurrentContact = createAction(
    '[Contact] Set Current Contact',
    props<{ contact: string }>()
);

export const setMessageStatus = createAction(
    '[Contact] Set Message Status',
    props<{ contact: string, isSeen: boolean }>()
);

export const loadChatHistory = createAction(
    '[Chat] Load Chat History',
    props<{ contact: string, page: number, pageSize: number }>()
);

export const loadChatHistorySuccess = createAction(
    '[Chat] Load Chat History Success',
    props<{ data: any[] }>()
);

export const loadChatHistoryFailure = createAction(
    '[Chat] Load Chat History Failure',
    props<{ error: string }>()
);
