import { metro, logger } from "@vendetta";
import Settings from "./Settings";

let timer: any;

function markAllRead() {
    try {
        const guildStore = metro.findByProps("getGuilds");
        const channelStore = metro.findByProps("getChannels");
        const readState = metro.findByProps("hasUnread", "lastMessageId");
        const dispatcher = metro.findByProps("dispatch");

        if (!guildStore || !channelStore || !readState || !dispatcher) {
            logger.error("No Unread Dots: could not find Discord modules");
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
                    messageId: messageId,
                    readStateType: 0,
                });
            }
        }

        if (channels.length === 0) {
            logger.log("No Unread Dots: nothing to mark");
            return;
        }

        dispatcher.dispatch({
            type: "BULK_ACK",
            context: "APP",
            channels,
        });

        logger.log(`No Unread Dots: marked ${channels.length} channels read`);
    } catch (e) {
        logger.error(`No Unread Dots: ${String(e)}`);
    }
}

export default {
    onLoad: () => {
        logger.log("No Unread Dots loaded");

        markAllRead();

        timer = setInterval(markAllRead, 5000);
    },

    onUnload: () => {
        if (timer) clearInterval(timer);
        timer = null;
    },

    settings: Settings,
};
