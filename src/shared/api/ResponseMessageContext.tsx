import {createContext, type PropsWithChildren, useContext, useState} from 'react';
import type {QueryKey} from "@tanstack/react-query";
import {enqueueSnackbar, SnackbarProvider as NOTISTACKProvider} from "notistack";
import type {AlertColor as TMessageType} from "@mui/material";
import CustomSnackbarAlert from "@ui/CustomSnackbarAlert.tsx";

interface IMessage<D = unknown> {
    type: TMessageType;
    message: string;
    queryKey: QueryKey | undefined;
    data: D | undefined;
    timestamp?: Date;
}

type IMessages<D = unknown> = Record<TMessageType, IMessage<D>[]>

interface ISnackbarContext<D = unknown> {
    messageQueue: IMessages<D>;
    showMessage: (message: IMessage<D>) => void;
    addToMessageQueue: (newMessage: IMessage<D>) => void;
    showMessagesFromQueue: (type?: TMessageType, queryKey?: QueryKey | undefined) => void
    getMessagesFromQueue: (type?: TMessageType, queryKey?: QueryKey | undefined) => IMessage<D>[]
    deleteMessagesFromQueue: (type: TMessageType, queryKey?: QueryKey | undefined) => void
}

const SnackbarContext = createContext<ISnackbarContext | undefined>(undefined);

function useSnackbar<D, >(): ISnackbarContext<D> {
    const context = useContext(SnackbarContext) as ISnackbarContext<D>;
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider (custom, not notistack)');
    }
    return context;
}


/**
 * ResponseMessagesProvider is a React component that manages a message queue and
 * provides methods to add, retrieve, display, and delete messages from the queue.
 *
 * This provider uses context to share state and functions related to message handling
 * across different components in the application. Messages can be of different answer-types
 * such as 'error', 'warning', 'success', and 'info'.
 *
 * @param {PropsWithChildren} children - The child components that will have access
 *                to the message queue and its related functions via context.
 *
 * The provider offers the following functionalities:
 * - Adding messages to the queue (`addToMessageQueue`).
 * - Retrieving messages from the queue based on type and/or query key (`getMessagesFromQueue`).
 * - Deleting messages from the queue based on type and an optional query key (`deleteMessagesFromQueue`).
 * - Displaying messages from the queue as snackbars (`showMessagesFromQueue`).
 * - Directly showing a snackbar notification (`showMessage`).
 */
function SnackbarProvider({children}: PropsWithChildren) {
    const [messageQueue, setMessageQueue] = useState<IMessages>({
        error: [],
        warning: [],
        success: [],
        info: [],
    });

    /**
     * Adds a new message to the message queue.
     *
     * @param {IMessage<D>} newMessage - The new message to be added to the queue. The message object contains a type and other data.
     * If a timestamp is not provided in the `newMessage`, the current date and time will be used.
     *
     * This function updates the message queue by adding the new message to the correct type array within the queue.
     * The queue is maintained by appending the message with its timestamp to the appropriate type inside the queue.
     *
     * @template D - The data type of the message.
     */
    const addToMessageQueue = <D, >(newMessage: IMessage<D>) => {
        const messageWithTimestamp = {
            ...newMessage,
            timestamp: newMessage.timestamp ?? new Date(),
        };

        setMessageQueue(prevMessages => ({
            ...prevMessages,
            [messageWithTimestamp.type]: [...prevMessages[messageWithTimestamp.type], messageWithTimestamp]
        }));
    };


    /**
     * Retrieves messages from the queue based on the specified type and/or query key.
     *
     * If both type and query key are provided, it filters the messages of the given type using the query key.
     * If only the type is provided, it returns all messages of that type.
     * If only the query key is provided, it searches for the query key in all answer-types of messages.
     * If neither is provided, it returns an empty array.
     *
     * @param {TMessageType} [type] - The type of messages to fetch from the queue.
     * @param {QueryKey} [queryKey] - The query key to use for filtering the messages.
     * @returns {IMessage[]} - An array of messages matching the criteria.
     */
    const getMessagesFromQueue = (type?: TMessageType, queryKey?: QueryKey | undefined): IMessage[] => {
        if (type && queryKey?.length) {
            return messageQueue[type].filter((msg) => {
                return msg.queryKey?.every((msgQueryKey, index) => msgQueryKey === queryKey[index])
            })
        } else if (type) {
            return messageQueue[type]
        } else if (queryKey?.length) {
            return messageQueue.info
                .concat(messageQueue.success)
                .concat(messageQueue.warning)
                .concat(messageQueue.error)
                .filter((msg) => msg.queryKey === queryKey)
        } else {
            return []
        }
    }

    /**
     * Deletes messages from the message queue based on the given type and an optional query key.
     *
     * @param {TMessageType} type - The type of messages to delete from the queue.
     * @param {QueryKey} [queryKey] - An optional query key to filter messages that should be deleted. If not provided,
     *                                 deletes all messages of the specified type that have a query key defined.
     */
    const deleteMessagesFromQueue = (type: TMessageType, queryKey?: QueryKey | undefined) => {
        setMessageQueue(prevMessages => ({
            ...prevMessages,
            [type]: prevMessages[type].filter((msg) => {
                if (queryKey === undefined) {
                    return msg.queryKey !== undefined;
                }
                return msg.queryKey?.every((msgQueryKey, index) => msgQueryKey !== queryKey[index]);
            })
        }));
    };

    /**
     * Processes and displays messages from the messages queue.
     *
     * Retrieves messages of the specified type and query key from the messages queue,
     * then displays each message using the `enqueueSnackbar` function.
     * Optionally deletes messages from the queue if a type is specified.
     *
     * @param {TMessageType} [type] - The type of messages to retrieve from the queue.
     * @param {QueryKey} [queryKey] - An optional key to filter the messages in the queue.
     */
    const showMessagesFromQueue = (type: TMessageType = "info", queryKey?: QueryKey | undefined) => {
        getMessagesFromQueue(type, queryKey).forEach((msgObj) => {
            enqueueSnackbar(msgObj.message, {variant: type,})
        })
        if (type) deleteMessagesFromQueue(type, queryKey)
    }

    /**
     * Displays a snackbar notification with a given message and type.
     *
     * @param {IMessage<D>} message - The message object containing the content and type of the notification.
     *
     * @template D - The data type of the message.
     * */
    const showMessage = <D, >(message: IMessage<D>) => {
        enqueueSnackbar(message.message, {variant: message.type,})
    }


    return (
        <SnackbarContext.Provider value={{
            messageQueue,
            showMessage,
            addToMessageQueue,
            getMessagesFromQueue,
            deleteMessagesFromQueue,
            showMessagesFromQueue
        }}>
            <NOTISTACKProvider maxSnack={3} Components={{
                success: CustomSnackbarAlert,
                default: CustomSnackbarAlert,
                error: CustomSnackbarAlert,
                warning: CustomSnackbarAlert,
                info: CustomSnackbarAlert,
            }}>
                {children}
            </NOTISTACKProvider>
        </SnackbarContext.Provider>
    );
}

export {
    SnackbarProvider,
    useSnackbar
}
