import { logger, metro } from "@vendetta";
import Settings from "./Settings";

let interval: ReturnType<typeof setInterval> | null = null;

function markEverythingRead() {
    try {
        const GuildStore = metro.findByProps("getGuilds");
        const GuildChannelStore = metro.findByProps("getChannels");
        const ReadStateStore = metro.findByProps(
            "hasUnread",
            "lastMessageId"
        );
        const FluxDispatcher = metro.findByProps(
            "dispatch",
            "subscribe"
        );

        if (
            !GuildStore ||
            !GuildChannelStore ||
            !ReadStateStore ||
            !FluxDispatcher
        ) {
            logger.log("No Unread Dots: required modules not found");
            return;
        }

        const channels: any[] = [];

        for (const guild of Object.values(GuildStore.getGuilds()) as any[]) {
            const channelData = GuildChannelStore.getChannels(guild.id);

            if (!channelData?.SELECTABLE) continue;

            for (const entry of channelData.SELECTABLE) {
                const channel = entry?.channel;
                if (!channel?.id) continue;

                if (!ReadStateStore.hasUnread(channel.id)) continue;

                const messageId = ReadStateStore.lastMessageId(channel.id);
                if (!messageId) continue;

                channels.push({
                    channelId: channel.id,
                    messageId,
                    readStateType: 0,
                });
            }
        }

        if (!channels.length) return;

        FluxDispatcher.dispatch({
            type: "BULK_ACK",
            context: "APP",
            channels,
        });

        logger.log(
            `No Unread Dots: marked ${channels.length} channel(s) as read`
        );
    } catch (e) {
        logger.error(`No Unread Dots: ${String(e)}`);
    }
}

export default {
    onLoad: () => {
        logger.log("No Unread Dots loaded");

        // Immediately clear unread channels
        markEverythingRead();

        // Keep clearing new unread channels
        interval = setInterval(markEverythingRead, 5000);
    },

    onUnload: () => {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }

        logger.log("No Unread Dots unloaded");
    },

    settings: Settings,
};
