import { Forms } from "@vendetta/ui/components";
import { storage } from "@vendetta/plugin";
import { React } from "@vendetta/metro/common";

const { FormSection, FormSwitchRow } = Forms;

export default () => {
    const [, forceUpdate] = React.useState(0);

    return (
        <FormSection title="Indicator Settings">
            <FormSwitchRow
                label="Hide white unread dots"
                subLabel="Hide unread indicators."
                value={storage.hideUnreadDots ?? true}
                onValueChange={(value) => {
                    storage.hideUnreadDots = value;
                    forceUpdate((n) => n + 1);
                }}
            />

            <FormSwitchRow
                label="Hide @ mention indicators"
                subLabel="Hide mention indicators."
                value={storage.hideMentionIndicators ?? true}
                onValueChange={(value) => {
                    storage.hideMentionIndicators = value;
                    forceUpdate((n) => n + 1);
                }}
            />
        </FormSection>
    );
};
