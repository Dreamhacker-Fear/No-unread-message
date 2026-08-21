import { ReactNative as RN, stylesheet } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { React } from "@vendetta/metro/common";

const { FormSection, FormRow, FormSwitch } = Forms;

export default () => {
    const [hideUnreadDots, setHideUnreadDots] = React.useState(true);
    const [hideMentionIndicators, setHideMentionIndicators] = React.useState(true);

    return (
        <RN.ScrollView>
            <FormSection title="Indicator Settings">
                <FormRow
                    label="Hide white unread dots"
                    subLabel="Hide the normal unread indicators."
                    trailing={
                        <FormSwitch
                            value={hideUnreadDots}
                            onValueChange={setHideUnreadDots}
                        />
                    }
                />

                <FormRow
                    label="Hide @ mention indicators"
                    subLabel="Hide indicators caused by mentions."
                    trailing={
                        <FormSwitch
                            value={hideMentionIndicators}
                            onValueChange={setHideMentionIndicators}
                        />
                    }
                />
            </FormSection>
        </RN.ScrollView>
    );
};
