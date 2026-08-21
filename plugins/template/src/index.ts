import { logger, metro, patcher } from "@vendetta";
import { storage } from "@vendetta/plugin";
import Settings from "./Settings";

let patches: (() => void)[] = [];

export default {
    onLoad: () => {
        logger.log("No Unread Dots loaded");

        const hideUnreadDots = storage.hideUnreadDots ?? true;
        const hideMentionIndicators = storage.hideMentionIndicators ?? true;

        try {
            // Discord's ReadStateStore exposes unread/mention state.
            const ReadStateStore = metro.findByProps(
                "ackMessageId",
                "getGuildChannelUnreadState"
            );

            if (!ReadStateStore) {
                logger.log("No Unread Dots: ReadStateStore not found");
                return;
            }

            logger.log("No Unread Dots: ReadStateStore found");

            // Keep the store from reporting unread/mention state.
            if (hideUnreadDots || hideMentionIndicators) {
                const original = ReadStateStore.getGuildChannelUnreadState;

                if (typeof original === "function") {
                    patches.push(
                        patcher.instead(
                            ReadStateStore,
                            "getGuildChannelUnreadState",
                            (_args, _original) => ({
                                unread: hideUnreadDots ? false : true,
                                mentionCount: hideMentionIndicators ? 0 : 1,
                                isMentionLowImportance: false,
                            })
                        )
                    );
                }
            }
        } catch (e) {
            logger.error(`No Unread Dots error: ${String(e)}`);
        }
    },

    onUnload: () => {
        patches.forEach((unpatch) => {
            try {
                unpatch();
            } catch {}
        });

        patches = [];
        logger.log("No Unread Dots unloaded");
    },

    settings: Settings,
};
