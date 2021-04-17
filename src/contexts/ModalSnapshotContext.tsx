import { useReducer, createContext, FC, ReactElement, useCallback } from 'react'

interface AttachmentReducerActionArgs {
    type: 'OPEN_MODAL' | 'CLOSE_MODAL';
    payload: boolean;
}

export interface ModalSnapshotProviderArgs {
    open: boolean;
    toggleModal?: () => void;
}

export const ModalContext = createContext<ModalSnapshotProviderArgs>({ open: false });

export const ModalSnapshotProvider: FC = ({ children }): ReactElement => {
    const [state, dispatch] = useReducer(attachmentReducer, { open: false });

    const toggleModal = useCallback(() => {
        dispatch({ type: state.open ? 'CLOSE_MODAL' : 'OPEN_MODAL', payload: !state.open });
    }, [dispatch, state]);

    return (
        <ModalContext.Provider value={{ ...state, toggleModal }}>
            {children}
        </ModalContext.Provider>
    )
}


const attachmentReducer = (state: ModalSnapshotProviderArgs, { type, payload }: AttachmentReducerActionArgs): ModalSnapshotProviderArgs => {
    switch (type) {
        case "OPEN_MODAL":
            return { ...state, open: payload };
        case "CLOSE_MODAL":
            // @ts-ignore
            return { ...state, open: payload };
    }
}