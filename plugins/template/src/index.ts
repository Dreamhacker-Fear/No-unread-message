import { logger, metro, patcher } from "@vendetta";
import Settings from "./Settings";

const patches: (() => void)[] = [];

export default {
    onLoad: () => {
        logger.log("No Unread Dots loaded");

        try {
            const modules = metro.findAll((m: any) => {
                if (!m || typeof m !== "object") return false;

                return Object.values(m).some(
                    (value: any) =>
                        typeof value === "function" &&
                        /unread|mention|badge|indicator/i.test(
                            value.name || ""
                        )
                );
            });

            logger.log(`No Unread Dots: found ${modules.length} candidate modules`);

            for (const module of modules) {
                for (const [key, value] of Object.entries(module)) {
                    if (
                        typeof value === "function" &&
                        /unread|mention|badge|indicator/i.test(
                            (value as Function).name || ""
                        )
                    ) {
                        logger.log(`Candidate: ${key}`);
                    }
                }
            }
        } catch (error) {
            logger.error(`No Unread Dots: ${String(error)}`);
        }
    },

    onUnload: () => {
        for (const unpatch of patches) {
            try {
                unpatch();
            } catch {}
        }

        patches.length = 0;
        logger.log("No Unread Dots unloaded");
    },

    settings: Settings,
};
