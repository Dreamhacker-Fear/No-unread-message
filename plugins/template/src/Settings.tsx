import { Forms } from "@vendetta/ui/components";
import { storage } from "@vendetta/plugin";

const { FormSection, FormSwitchRow } = Forms;

export default () => (
    <FormSection title="Indicator Settings">
        <FormSwitchRow
            label="Hide white unread dots"
            subLabel="Hide unread indicators."
            value={storage.hideUnreadDots ?? true}
            onValueChange={(value) => {
                storage.hideUnreadDots = value;
            }}
        />

        <FormSwitchRow
            label="Hide @ mention indicators"
            subLabel="Hide mention indicators."
            value={storage.hideMentionIndicators ?? true}
            onValueChange={(value) => {
                storage.hideMentionIndicators = value;
            }}
        />
    </FormSection>
);
