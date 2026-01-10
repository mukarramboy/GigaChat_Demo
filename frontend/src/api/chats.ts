import type { Chat, ChatDetail } from '../types';

const API_BASE = '/api/v1';

export const getChats = async (userId: number): Promise<Chat[]> => {
    const response = await fetch(`${API_BASE}/chats?user_id=${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch chats');
    }
    return response.json();
};

export const getChatDetails = async (chatId: number): Promise<ChatDetail> => {
    const response = await fetch(`${API_BASE}/chats/${chatId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch chat details');
    }
    return response.json();
};

export const deleteChat = async (chatId: number, userId: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/chats/${chatId}?user_id=${userId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        if (response.status === 403) {
            throw new Error('Вы можете удалить только свои чаты');
        }
        if (response.status === 404) {
            throw new Error('Чат не найден');
        }
        throw new Error('Не удалось удалить чат');
    }
};
