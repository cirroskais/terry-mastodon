import type { MegalodonInterface } from "megalodon";
import type { Account } from "megalodon/lib/src/entities/account";
import { generate } from "../lib/OllamaHandler";

export default async function post(client: MegalodonInterface, user: Account) {
    const response = await generate([
        { role: "user", content: "Write a Mastodon post for your followers in under 500 characters." },
    ]);
    if (response.message.content.length > 500) return;

    console.log(response.message.content);

    client.postStatus(response.message.content, {
        spoiler_text: "automated account, llm generated content, satire",
        visibility: "unlisted",
    });
}
