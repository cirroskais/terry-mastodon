import generator, { type Entity } from "megalodon";
import { handle } from "./lib/NotificationHandler";

const BASE_URL: string = process.env.MASTODON_URL;
const ACCESS_TOKEN: string = process.env.MASTODON_ACCESS_TOKEN;

const client = generator("mastodon", BASE_URL, ACCESS_TOKEN);
const user = await client.verifyAccountCredentials();

client.userStreaming().then((stream) => {
    stream.on("connect", async () => {
        console.log("[index.ts] Connected to Mastodon as", user.data.acct);
    });

    stream.on("close", () => {
        console.log("[index.ts] Disconnected from Mastodon");
    });

    stream.on("notification", (notification) => handle(client, notification, user.data));

    stream.on("error", (err: Error) => {
        console.error(err);
    });

    stream.on("parser-error", (err: Error) => {
        console.error(err);
    });
});
