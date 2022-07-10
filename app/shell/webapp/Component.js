// Copyright (c) 2009-2022 SAP SE, All Rights Reserved

/**
 * @fileOverview The SAPUI5 component of SAP's Fiori sandbox renderer for the Unified Shell.
 *
 * @version 1.101.0
 */
/**
 * @namespace Namespace for SAP's Fiori sandbox renderer for the Unified Shell. The renderer consists
 * of an SAPUI5 component called <code>sap.ushell.renderers.sandbox.Renderer</code>.
 *
 * @name sap.ushell.renderers.fiorisandbox
 * @see sap.ushell.renderers.fiorisandbox.Renderer
 * @since 1.15.0
 * @private
 */
sap.ui.define([
    "sap/ui/core/library",
    "sap/ui/core/UIComponent",
    "sap/ushell/services/ShellNavigation"
], function (coreLibrary, UIComponent, ShellNavigation) {
    "use strict";

    var ViewType = coreLibrary.mvc.ViewType;
    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>
     * sap.ushell.Container.createRenderer("sap.ushell.renderers.fiorisandbox.Renderer")
     * </code>.
     *
     * @class The SAPUI5 component of the Fiori sandbox renderer for the Unified Shell.
     *
     * @extends sap.ui.core.UIComponent
     * @name sap.ushell.renderers.fiorisandbox.Renderer
     * @see sap.ushell.services.Container#createRenderer
     * @since 1.15.0
     */
    return UIComponent.extend("fiori.shell.Component", {
        metadata: {
            version: "1.101.0",
            dependencies: {
                version: "1.101.0",
                libs: ["sap.ui.core"],
                components: []
            },
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },
        // eslint-disable-next-line valid-jsdoc
        /**
         * *TODO*
         *
         * @returns *TODO*
         *
         * @methodOf sap.ushell.renderers.fiorisandbox.Renderer#
         * @name createContent
         * @since 1.15.0
         *
         * @private
         */
        createContent: function () {
            var oComponentData = this.getComponentData();
            if (oComponentData && oComponentData.async) {
                return new Promise(function (resolve, reject) {
                    sap.ui.require(["sap/ui/core/mvc/View"], function (View) {
                        View.create({
                            type: ViewType.XML,
                            viewName: "fiori.shell.Shell",
                            viewData: oComponentData
                        }).then(resolve).catch(reject);
                    });
                });
            }
            return sap.ui.view({
                type: ViewType.XML,
                viewName: "fiori.shell.Shell",
                viewData: oComponentData
            });
        }
    });

});
