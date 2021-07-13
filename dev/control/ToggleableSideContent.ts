import Control from "sap/ui/core/Control";
import { CSSSize } from "sap/ui/core/library";
import { SideContentPosition } from "sap/ui/layout/library";

/**
 * Control with a main part and a toggleable side content.
 *
 * @namespace devepos.qdrt.control
 */
export default class ToggleableSideContent extends Control {
    metadata = {
        properties: {
            /**
             * Defines if the side content view will be shown or not
             */
            sideContentVisible: { type: "boolean", group: "Misc", defaultValue: true },
            /**
             * Width of the side content
             */
            sideContentWidth: { type: "sap.ui.core.CSSSize", group: "Appearance", defaultValue: "350px" },
            /**
             * Position of the side content. The default position is on the right side
             */
            sideContentPosition: { type: "sap.ui.layout.SideContentPosition", group: "Appearance", defaultValue: "End" }
        },
        defaultAggregation: "content",
        aggregations: {
            /**
             * Main content which normally should hold a table control like
             * {@link sap.m.Table}
             */
            content: { type: "sap.ui.core.Control", multiple: false, singularName: "content" },
            /**
             * The side control
             */
            sideContent: { type: "sap.ui.core.Control", multiple: true, singularName: "sideContent" }
        },
        events: {}
    };

    //#region methods generated by ui5 library for metadata
    getSideContentVisible?(): boolean;
    setSideContentVisible?(visible: boolean): this;
    getContentWidth?(): CSSSize;
    setContentWidth?(width: CSSSize): this;
    getSideContentWidth?(): CSSSize;
    setSideContentWidth?(width: CSSSize): this;
    getSideContentPosition?(): SideContentPosition;
    setSideContentPosition?(position: SideContentPosition): this;
    getSideContent?(): Control[];
    setSideContent?(sideContent: Control): this;
    getContent?(): Control;
    addSideContent?(control: Control): this;
    removeAllSideContent?(): this;
    setContent?(content: Control): this;
    //#endregion
}
