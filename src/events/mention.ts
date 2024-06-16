import { load } from "cheerio";
import type { Entity, MegalodonInterface } from "megalodon";
import type { Account } from "megalodon/lib/src/entities/account";
import { account, thread } from "../lib/Resolver";
import { generate } from "../lib/OllamaHandler";

function formatContent(content: string) {
    return load(content).text();
}

export default async function mention(client: MegalodonInterface, { status }: Entity.Notification, user: Account) {
    if (!status?.content) return;
    if (status.account.acct === user.acct) return;
    if (formatContent(status.account?.note).includes("#nobot")) return;

    const resolvedThread = await thread(client, status);
    let formattedThread = [];
    for (let post of resolvedThread) {
        let parentPostAuthor;
        if (post.in_reply_to_account_id) parentPostAuthor = await account(client, post.in_reply_to_account_id);

        formattedThread.push({
            role: post.account.acct === user.acct ? "assistant" : "user",
            content:
                post.account.acct === user.acct
                    ? formatContent(post.content)
                    : `@${post.account.acct}@${new URL(post.account.url).hostname} says: "${formatContent(post.content)}"`,
        });
    }

    const response = await generate(formattedThread);

    console.log(response.message.content);

    client.postStatus(response.message.content, {
        in_reply_to_id: status.id,
        spoiler_text: "automated account, llm generated content, satire",
        visibility: "unlisted",
    });
}
