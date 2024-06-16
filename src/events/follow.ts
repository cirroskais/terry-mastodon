import type { Entity, MegalodonInterface } from "megalodon";
import { generate } from "../lib/OllamaHandler";

let lastThankYou = 0;

export default async function follow(client: MegalodonInterface, notification: Entity.Notification) {
    if (Date.now() - lastThankYou < 1000 * 60 * 10) return;
    lastThankYou = Date.now();

    if (!notification.account) return;
    const response = await generate([
        {
            role: "user",
            content: `@${notification.account.acct}@${new URL(notification.account.url).hostname} just followed you on social media. Thank them or say hello.`,
        },
    ]);

    client.postStatus(response.message.content, {
        spoiler_text: "automated account, llm generated content, satire",
        visibility: "unlisted",
    });
}
