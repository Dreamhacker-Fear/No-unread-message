import { logger, metro } from "@vendetta";
import Settings from "./Settings";

export default {
    onLoad: () => {
        logger.log("No Unread Dots: loaded");

        try {
            const modules = metro.findAll(
                (m: any) =>
                    m &&
                    typeof m === "object" &&
                    (
                        typeof m.getUnreadCount === "function" ||
                        typeof m.hasUnread === "function" ||
                        typeof m.ackMessageId === "function"
                    )
            );

            logger.log(
                `No Unread Dots: found ${modules.length} read-state module(s)`
            );

            for (const module of modules) {
                logger.log(module);
            }
        } catch (e) {
            logger.error(`No Unread Dots: ${e}`);
        }
    },

    onUnload: () => {
        logger.log("No Unread Dots: unloaded");
    },

    settings: Settings,
};
