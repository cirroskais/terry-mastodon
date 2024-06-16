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
            content: `@${notification.account.acct}@${new URL(notification.account.url).hostname} followed you on Mastodon. Write a post thanking them for following.`,
        },
    ]);

    client.postStatus(response.message.content, {
        spoiler_text: "automated account, llm generated content, satire",
        visibility: "unlisted",
    });
}
