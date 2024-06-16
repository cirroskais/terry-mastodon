import { Ollama, type Message } from "ollama";

const ollama = new Ollama({ host: process.env.OLLAMA_URL });

export async function generate(history: Message[]) {
    return await ollama.chat({
        model: process.env.OLLAMA_MODEL,
        messages: history,
    });
}
