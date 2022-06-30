sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("fiori.roles.controller.Overview", {
        onInit: function () {

        },

        onOpenInsertDialog: async function(oEvent) {
            var sDialogName = oEvent.getSource().data('dialogName');
			var oDialog = await this.getDialog(sDialogName);
            var oContext = this.getModel().createEntry('/Roles');
            var sPath = oContext.getPath();

            oDialog.bindElement(sPath);
			oDialog.open();
        },

        onInsert: function(oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = oSource.getParent();
            var oProperty = oSource.getBindingContext().getProperty();
            var oSubmitPromise = this.models.submitChanges.call(this, { groupId: 'roles' });

            oSubmitPromise.then(() => {
                this.getRouter().navTo('Details', {
                    path: oProperty.ID
                });

                oDialog.close();
            });
        },

        onCancel: function(oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = oSource.getParent();
            var sPath = oDialog.getBindingContext().getPath();

            this.models.resetChanges.call(this, [ sPath ], undefined, true);
            oDialog.close();
        },

        onNavToDetails: function(oEvent) {
            var oSource = oEvent.getSource();
            var oProperty = oSource.getBindingContext().getProperty();

            this.getRouter().navTo('Details', {
                path: oProperty.ID
            });
        }
    });
});
