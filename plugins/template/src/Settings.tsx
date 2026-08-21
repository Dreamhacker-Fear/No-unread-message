import { Forms } from "@vendetta/ui/components";

const { FormSection, FormSwitchRow } = Forms;

export default () => (
    <FormSection title="Indicator Settings">
        <FormSwitchRow
            label="Hide white unread dots"
            subLabel="Hide unread indicators."
            value={true}
            onValueChange={() => {}}
        />
    </FormSection>
);
