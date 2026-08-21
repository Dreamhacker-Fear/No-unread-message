import { logger, metro } from "@vendetta";
import Settings from "./Settings";

export default {
    onLoad: () => {
        logger.log("No Unread Dots loaded");

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

            logger.log(`Found ${modules.length} possible read-state modules`);
        } catch (e) {
            logger.error(`No Unread Dots error: ${e}`);
        }
    },

    onUnload: () => {
        logger.log("No Unread Dots unloaded");
    },

    settings: Settings,
};
