sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController,JSONModel) {
    "use strict";
    
    
    
    return BaseController.extend("fiori.actions.controller.Overview", {
        onInit: function () {
            var oData = {
                data: null,
                bindingContextPath: null,
                isSelected: false
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "SelectedItem");
        },

        onSelectionChange: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oSelectedData = oSelectedItem.getBindingContext().getProperty();
            var sPath = oSelectedItem.getBindingContext().getPath();
            this.getModel("SelectedItem").setData({
                data: oSelectedData,
                bindingContextPath: sPath,
                isSelected: true
            })
        },

        onOpenInsertDialog: async function(oEvent) {
            var sAction = oEvent.getSource().data('actionName');
            var sDialogName = oEvent.getSource().data('dialogName');
			var oDialog = await this.getDialog(sDialogName);
            var sPath;
            var oContext;

            if (sAction == 'Insert'){
                oContext= this.getModel().createEntry('/Actions');
                sPath = oContext.getPath();
            } else if (this.getModel("SelectedItem").getProperty("/data") !== null) {
                sPath = this.getModel("SelectedItem").getProperty("/bindingContextPath")
            }
            
            oDialog.bindElement(sPath);
			oDialog.open();
        },

        onInsert: function(oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = oSource.getParent();
            var oProperty = oSource.getBindingContext().getProperty();

            this.getModel().submitChanges({
                success: function(oResponse) {

                    sap.m.MessageBox.show(this.getView().getModel("i18n").getResourceBundle().getText("onInsert"),{
                        icon: sap.m.MessageBox.Icon.SUCCESS
                    });
                    
                    oDialog.close();
                }.bind(this),
                error: function(oResponse) {

                }.bind(this)
            });
            this.getView().byId("idActionsTable").removeSelections(true);
            this.getModel("SelectedItem").setData({
                isSelected: false
            })
           
        },

        onEdit: function(oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = oSource.getParent();
            var oProperty = oSource.getBindingContext().getProperty();
            var sPath = this.getModel("SelectedItem").getData().bindingContextPath;

           
            this.getModel().submitChanges({
                success: function(oResponse) {

                    sap.m.MessageBox.show(this.getView().getModel("i18n").getResourceBundle().getText("onEdit"),{
                        icon: sap.m.MessageBox.Icon.SUCCESS
                    });
                    
                    oDialog.close();
                }.bind(this),
                error: function(oResponse) {

                }.bind(this)
            });
        },

        onDelete: function(oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = oSource.getParent();
            var sPath = this.getModel("SelectedItem").getData().bindingContextPath;

            this.getModel().remove(sPath, {
                success: function(oResponse) {
                   
                    sap.m.MessageBox.show(this.getView().getModel("i18n").getResourceBundle().getText("onDelete"), {
                        icon: sap.m.MessageBox.Icon.SUCCESS
                    });
                    
                    oDialog.close();
                }.bind(this),
                error: function(oResponse) {

                }.bind(this)
            });
            this.getModel("SelectedItem").setData({
                isSelected: false
            })

        },

        onCancel: function(oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = oSource.getParent();
            var sPath = this.getModel("SelectedItem").getData().bindingContextPath;

            this.getModel().resetChanges()
            
            oDialog.close();
        }
    });
});
