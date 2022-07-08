sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "./ErrorHandler"
], function (BaseController,JSONModel, ErrorHandler) {
    "use strict";
    
    
    
    return BaseController.extend("fiori.actions.controller.Overview", {
        onInit: function () {
            var oData = {
                selectedAction: {
                    data: null,
                    bindingContextPath: null,
                    isSelected: false
                }
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "view");
        },

        onSelectionChange: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oSelectedData = oSelectedItem.getBindingContext().getProperty();
            var sPath = oSelectedItem.getBindingContext().getPath();
            this.getModel("view").setProperty("/selectedAction", {
                    data: oSelectedData,
                    bindingContextPath: sPath,
                    isSelected: true
            })
        },

        onOpenInsertDialog: async function(oEvent) {
            var sAction = oEvent.getSource().data('actionName');
            var sDialogName = oEvent.getSource().data('dialogName');
			var oDialog = await this.getDialog(sDialogName);
            var sPath, oContext;
            var oModel = this.getModel("view")
            var bIsSelected = oModel.getProperty("/selectedAction/isSelected")

            if (sAction === 'Insert'){
                oContext= this.getModel().createEntry('/Actions');
                sPath = oContext.getPath();
            } else if (bIsSelected) {
                sPath = oModel.getProperty("/selectedAction/bindingContextPath")
            } else {
                sap.m.MessageToast.show(this.getResourceBundle().getText("NotSelected"));
                return;
            }
            
            oDialog.bindElement(sPath);
			oDialog.open();
        },

        onInsert: function(oEvent) {
           this._changeEntity(oEvent,"onInsert");
           this._removeSelection();
        },

        onEdit: function(oEvent) {
           this._changeEntity(oEvent,"onEdit");
        },

        onDelete: function(oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = oSource.getParent();
            var sPath = this.getModel("view").getProperty("/selectedAction/bindingContextPath");

            this.getModel().remove(sPath, {
                success: function(oResponse) {

                    sap.m.MessageBox.show(this.getResourceBundle().getText("onDelete"), {
                        icon: sap.m.MessageBox.Icon.SUCCESS
                    });
                    
                    oDialog.close();
                    this._removeSelection();
                }.bind(this),
                error: function(oResponse) {
                    sap.m.MessageBox.error(JSON.parse(oResponse.responseText).error.message.value,{
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: this.getResourceBundle().getText("ErrorTitle"),
                        details: oResponse.responseText
                    });
                }.bind(this)
            });
        },

        onCancel: function(oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = oSource.getParent();

            this.getModel().resetChanges();
            
            oDialog.close();
        },

        _removeSelection: function(){
            this.getView().byId("idActionsTable").removeSelections(true);
            this.getModel("view").setProperty("/selectedAction", {
                data: null,
                bindingContextPath: null,
                isSelected: false
            });
        },

        _changeEntity: function(oEvent, sMessage){
            var oSource = oEvent.getSource();
            var oDialog = oSource.getParent();

            // if (this.getBindingContext())

            this.getModel().submitChanges({
                success: function(oResponse) {
                    for (var i=0; i<oResponse.__batchResponses.length; i++){
                        var oBatchResponse = oResponse.__batchResponses[i];
                        if (oBatchResponse._changeResponses) {
                            for (var i=0; i<oBatchResponse._changeResponses.length; i++){
                                var statusCode = oBatchResponse._changeResponses[i].statusCode
                                if (statusCode.indexOf('2') != 0) {
                                    return sap.m.MessageBox.error(oBatchResponse[i].message,{
                                        icon: sap.m.MessageBox.Icon.ERROR,
                                        title: this.getResourceBundle().getText("ErrorTitle"),
                                        details: oBatchResponse[i].response
                                    })
                                }
                            }
                        } else {
                            sap.m.MessageBox.error(oBatchResponse.message,{
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: this.getResourceBundle().getText("ErrorTitle"),
                                details: oBatchResponse.response.body
                            });
                            return;
                        }
                    }

                    sap.m.MessageBox.show(this.getResourceBundle().getText(sMessage),{
                        icon: sap.m.MessageBox.Icon.SUCCESS
                    });
                    
                    oDialog.close();
                }.bind(this),
                error: function(oResponse) {
                    
                    sap.m.MessageBox.show(JSON.parse(oResponse.responseText).error.message.value,{
                        icon: sap.m.MessageBox.Icon.SUCCESS,
                        title: this.getResourceBundle().getText("ErrorTitle")
                    });
                }.bind(this)
            });
        }
    });
});
