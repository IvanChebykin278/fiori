sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/library"
], function (BaseController,JSONModel,library) {
    "use strict";
    
    
    
    return BaseController.extend("fiori.actions.controller.Overview", {
        
        onInit: function () {
            BaseController.prototype.onInit.apply(this, arguments);

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
                    this.getModel().refresh(true);
                    oDialog.close();
                    this._removeSelection();
                }.bind(this),
                error: function(oResponse) {
                    sap.m.MessageBox.error(JSON.parse(oResponse.responseText).error.message.value,{
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: this.getResourceBundle().getText("ErrorTitle"),
                        details: oResponse.responseText
                    });
                    this.getModel().refresh(true);
                }.bind(this)
            });
            
        },

        onCancel: function(oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = oSource.getParent();

            this.getModel().resetChanges();
            this.getModel().refresh(true);
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
            var oBindingContext = oDialog.getBindingContext();
            var oModel = oBindingContext.getModel();
            var semanticObjectInsertSuccess = this.getResourceBundle().getText(sMessage);
            
            this.getModel().submitChanges({
            
                success: function(oResponse) {

                        var aMessages = oModel.getMessages(oBindingContext);

                        var bIsError = aMessages.reduce(function(result, oMessage){

                            var isCorrectTarget = oMessage.getTarget() === oBindingContext.getPath() + "/action";
                            var isError = oMessage.getType() === library.MessageType.Error;

                            return (isCorrectTarget && isError) || result;

                        }, false);

                        if (!bIsError){
                            sap.m.MessageToast.show(semanticObjectInsertSuccess);
                            oDialog.close();
                        }

                        
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
