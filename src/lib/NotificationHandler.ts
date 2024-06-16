import type { Entity, MegalodonInterface } from "megalodon";
import type { Account } from "megalodon/lib/src/entities/account";

import favourite from "../events/favourite";
import mention from "../events/mention";
import follow from "../events/follow";

const events = {
    favourite: favourite,
    mention: mention,
    follow: follow,
};

export async function handle(client: MegalodonInterface, notification: Entity.Notification, user: Account) {
    const event = events[notification.type as keyof typeof events];
    if (!event) return console.log("[NotificationHandler.ts] Unhandled notification type", notification.type);

    return event(client, notification, user);
}
