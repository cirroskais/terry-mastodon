import type { MegalodonInterface } from "megalodon";
import type { Status } from "megalodon/lib/src/entities/status";

async function threadWalker(client: MegalodonInterface, id: string, messages: Status[]) {
    const status = (await client.getStatus(id))?.data;
    if (!status) return messages;

    messages.push(status);
    if (status.in_reply_to_id) {
        return await threadWalker(client, status.in_reply_to_id, messages);
    } else {
        return messages;
    }
}

export async function thread(client: MegalodonInterface, status: Status) {
    let messages: Status[] = [status];

    if (!status.in_reply_to_id) return messages;
    return (await threadWalker(client, status.in_reply_to_id, messages)).reverse();
}

export async function mentions() {}

export async function account(client: MegalodonInterface, id: string) {
    return (await client.getAccount(id)).data;
}
