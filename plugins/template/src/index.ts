import { logger } from "@vendetta";
import Settings from "./Settings";

export default {
    onLoad: () => {
        logger.log("No Unread Dots loaded");
    },

    onUnload: () => {
        logger.log("No Unread Dots unloaded");
    },

    settings: Settings,
};
