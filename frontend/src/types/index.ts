export interface Chat {
    chat_id: number;
    created_at: string;
}

export interface Prompt {
    id: number;
    type: string;
    prompt: string;
    response: string;
    created_at: string;
}

export interface ChatDetail {
    chat_id: number;
    prompts: Prompt[];
}
