import { metro, logger } from "@vendetta";
import Settings from "./Settings";

let timer: any;
let clearedCount = 0;

function markAllRead() {
    try {
        const guildStore = metro.findByProps("getGuilds");
        const channelStore = metro.findByProps("getChannels");
        const readState = metro.findByProps("hasUnread", "lastMessageId");
        const dispatcher = metro.findByProps("dispatch");

        if (!guildStore || !channelStore || !readState || !dispatcher) {
            return;
        }

        const channels: any[] = [];

        for (const guild of Object.values(guildStore.getGuilds()) as any[]) {
            const data = channelStore.getChannels(guild.id);

            if (!data?.SELECTABLE) continue;

            for (const item of data.SELECTABLE) {
                const id = item?.channel?.id;
                if (!id) continue;

                if (!readState.hasUnread(id)) continue;

                const messageId = readState.lastMessageId(id);
                if (!messageId) continue;

                channels.push({
                    channelId: id,
                    messageId,
                    readStateType: 0,
                });
            }
        }

        if (!channels.length) return;

        dispatcher.dispatch({
            type: "BULK_ACK",
            context: "APP",
            channels,
        });

        // Count every channel acknowledged by this pass
        clearedCount += channels.length;

        logger.log(
            `No Unread Dots: cleared ${channels.length} channels (total: ${clearedCount})`
        );
    } catch (e) {
        logger.error(`No Unread Dots: ${String(e)}`);
    }
}

export default {
    onLoad: () => {
        logger.log("No Unread Dots loaded");

        clearedCount = 0;

        markAllRead();

        timer = setInterval(markAllRead, 250);
    },

    onUnload: () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    },

    settings: Settings,
};
