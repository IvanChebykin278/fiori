sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"../model/models",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
    'sap/m/MessagePopover',
	'sap/m/MessageItem'
], function (Controller,formatter,models,History,Fragment,MessagePopover,MessageItem) {
	"use strict";

	return Controller.extend("fiori.designer.controller.BaseController", {
        models: models,
        formatter: formatter,

        onInit: function() {
           
        },

        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        showError: function() {
            JSON.parse(oResponse.responseText).error.message.value;
        },

        onNavBack: function () {
            var sPreviousHash = History.getInstance().getPreviousHash(),
                oCrossAppNavigator = sap.ushell.Container.getService(
                "CrossApplicationNavigation"
                );

            if (
                sPreviousHash !== undefined ||
                !oCrossAppNavigator.isInitialNavigation()
            ) {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("Overview", {}, true);
            }
        },

        getDialog: async function (sDialogName) {
            var oView = this.getView();

            if (!this[sDialogName]) {
                this[sDialogName] = await Fragment.load({
                    id: sDialogName,
                    name: "fiori.designer.view.fragments." + sDialogName,
                    controller: this,
                });

                oView.addDependent(this[sDialogName]);
            }

            var oDialog = await this[sDialogName];
            oDialog.attachEventOnce('afterClose',function(oEvent){
                oEvent.getSource().unbindElement();
                this.getModel().refresh(false);
            }, this);
            return oDialog;
        },
        handleMessagePopoverPress: function(oEvent) {

            this.oMessagePopover.toggle(oEvent.getSource());
        },
        
        onUpdateFinished : function(sTabKey){
			var firstItem = this.getView().byId(`idList${sTabKey}`).getItems()[0];   
			this.getView().byId(`idList${sTabKey}`).setSelectedItem(firstItem,true);
			var oSelectedData = firstItem.getBindingContext().getProperty();
            var sPath = firstItem.getBindingContext().getPath();
            this.getModel("selectedItem").setProperty("/selectedItem", {
                    data: oSelectedData,
                    bindingContextPath: sPath,
                    isSelected: true
			});
			var sCatalogId = firstItem.getBindingContext().getProperty("ID");
			this.getOwnerComponent().getRouter()
				.navTo(`${sTabKey}Details`,
					{ID:sCatalogId},
					!Device.system.phone);

		}
    });
});