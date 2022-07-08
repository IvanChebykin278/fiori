sap.ui.define([
    "./BaseController",
    "sap/ui/core/library"
], function (BaseController,library) {
    "use strict";

    return BaseController.extend("fiori.roles.controller.Overview", {
        onInit: function () {
            BaseController.prototype.onInit.apply(this, arguments);
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
            var oBindingContext = oDialog.getBindingContext();
            var oProperty = oBindingContext.getProperty();
            var oSubmitPromise = this.models.submitChanges.call(this, { groupId: 'roles' });

            oSubmitPromise.then(() => {
                var aMessages = oBindingContext.getModel().getMessages(oBindingContext);
                var isErrorMessages = aMessages.reduce(function(result, oMessage) {
                    var isCorrectTarget = oMessage.getTarget() === oBindingContext.getPath() + '/ID';
                    var isErrorType = oMessage.getType() === library.MessageType.Error;

                    return (isCorrectTarget && isErrorType) || result;
                }.bind(this), false);

                if(!isErrorMessages) {
                    this.getRouter().navTo('Details', {
                        path: oProperty.ID
                    });

                    oDialog.close();
                }
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
