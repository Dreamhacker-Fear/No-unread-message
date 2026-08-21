import { logger, metro } from "@vendetta";
import Settings from "./Settings";

function markAllRead() {
    try {
        const GuildStore = metro.findByProps("getGuilds");
        const GuildChannelStore = metro.findByProps("getChannels");
        const ReadStateStore = metro.findByProps("lastMessageId", "hasUnread");
        const Dispatcher = metro.findByProps("dispatch", "subscribe");

        if (!GuildStore || !GuildChannelStore || !ReadStateStore || !Dispatcher) {
            logger.log("No Unread Dots: modules not found");
            return;
        }

        const channels: any[] = [];

        Object.values(GuildStore.getGuilds()).forEach((guild: any) => {
            const data = GuildChannelStore.getChannels(guild.id);

            if (!data?.SELECTABLE) return;

            data.SELECTABLE.forEach((entry: any) => {
                const channel = entry?.channel;
                if (!channel?.id) return;

                if (!ReadStateStore.hasUnread(channel.id)) return;

                const messageId = ReadStateStore.lastMessageId(channel.id);
                if (!messageId) return;

                channels.push({
                    channelId: channel.id,
                    messageId,
                    readStateType: 0,
                });
            });
        });

        if (channels.length === 0) {
            logger.log("No Unread Dots: nothing unread");
            return;
        }

        Dispatcher.dispatch({
            type: "BULK_ACK",
            context: "APP",
            channels,
        });

        logger.log(
            `No Unread Dots: marked ${channels.length} channels as read`
        );
    } catch (e) {
        logger.error(`No Unread Dots: ${String(e)}`);
    }
}

let timer: ReturnType<typeof setInterval> | null = null;

export default {
    onLoad: () => {
        logger.log("No Unread Dots loaded");

        markAllRead();

        timer = setInterval(markAllRead, 5000);
    },

    onUnload: () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }

        logger.log("No Unread Dots unloaded");
    },

    settings: Settings,
};
