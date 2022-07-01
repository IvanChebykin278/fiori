sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'jquery.sap.global'
],  function (BaseController, JSONModel, MessageBox, Jquery) {
        "use strict";

        return BaseController.extend("fiori.semanticobjects.controller.Overview", {

            onInit: function () {

                var oData = {
                    data: null,
                    bindingContextPath: null,
                    isSelected: false
                };
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "SelectedItem");
                
            },


            // Почему jquery не отрабатывается?
            // onAfterRendering: function() {
            //     var that = this;
            //     var oPage = this.getView().byId("idOverviewPage");
            //     $('#' + oPage.getId()).on("click", function() {
            //       console.log("test");
            //       var oTable = that.getView().byId("semanticObjectsTable");
            //       oTable.removeSelections(true);
            //     });
            // },

            selectionChange: function(oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var oSelectedProperty = oSelectedItem.getBindingContext().getProperty();
                var sSelectedPath = oSelectedItem.getBindingContext().getPath();
                this.getModel("SelectedItem").setData({
                    data: oSelectedProperty,
                    bindingContextPath: sSelectedPath,
                    isSelected: true
                });
            },

            onOpenInsertDialog: async function(oEvent) {
                var sDialogName = oEvent.getSource().data('dialogName');
                var oDialog = await this.getDialog(sDialogName);
                var oContext = this.getModel().createEntry('/SemanticObjects');
                var sPath = oContext.getPath();
    
                oDialog.bindElement(sPath);
                oDialog.open();
            },

            onEditInsertDialog : async function(oEvent){
                // var fragmentId = this.getView().createId("sDialogName");
                // var oInput = Fragment.byId(fragmentId, "semanticObjectEdit");
                // var sSemanticObject = this.getModel('SelectedItem').getProperty("/data/semanticObject")
                // oInput.setValue(sSemanticObject);
                var sDialogName = oEvent.getSource().data('dialogName');
                var oDialog = await this.getDialog(sDialogName);

                var sPath =  this.getModel("SelectedItem").getData().bindingContextPath;

                oDialog.bindElement(sPath);
                oDialog.open();
            },

            onCancel: function(oEvent) {
                var oSource = oEvent.getSource();
                var oDialog = oSource.getParent();
                var sPath = oDialog.getBindingContext().getPath();
    
                this.getModel().resetChanges([ sPath ], undefined, true);
                oDialog.close();
            },

            onInsert: function(oEvent) {
                var oSource = oEvent.getSource();
                var oDialog = oSource.getParent();
                var oProperty = oSource.getBindingContext().getProperty();
                var i18n = this.getView().getModel("i18n").getResourceBundle()

                this.getModel().submitChanges({
                    success: function(oResponse) {

                        // this.getRouter().navTo('Details', {
                        //     path: oProperty.ID
                        // });
                        
                        sap.m.MessageToast.show(i18n.getText("semanticObjectInsertSccsess"));
                        
                        oDialog.close();
                    }.bind(this),
                    error: function(oResponse) {
    
                    }.bind(this)
                });
                
                this.getView().byId("semanticObjectsTable").removeSelections(true);
                this.getModel("SelectedItem").setData({
                    data: null,
                    bindingContextPath: null,
                    isSelected: false
                });
            },

            onEdit: function(oEvent) {
                var oSource = oEvent.getSource();
                var oDialog = oSource.getParent();
                var sPath =  this.getModel("SelectedItem").getData().bindingContextPath;
                var oData = this.getModel().getObject(sPath);
                var i18n = this.getView().getModel("i18n").getResourceBundle()

                this.getModel().submitChanges({
                    //groupId: 'roles',
                    success: function(oResponse) {

                        // this.getRouter().navTo('Details', {
                        //     path: oProperty.ID
                        // });
    
                        sap.m.MessageToast.show(i18n.getText("semanticObjectEditedSccsess"));
                        
                        oDialog.close();
                    }.bind(this),
                    error: function(oResponse) {
    
                    }.bind(this)
                });

                this.getView().byId("semanticObjectsTable").removeSelections(true);
                this.getModel("SelectedItem").setData({
                    data: null,
                    bindingContextPath: null,
                    isSelected: false
                });
            },


            onDeleteDialog : function(oEvent){
                
                var sPath =  this.getModel("SelectedItem").getData().bindingContextPath;
                var i18n = this.getView().getModel("i18n").getResourceBundle()
            
                MessageBox.warning(i18n.getText("deletSematicObjectMessageBoxTitile"), {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,

                    onClose: function (sAction) {
                        if (sAction == "OK"){

                            this.getModel().remove(sPath, {
                                success: function(oResponse) {
            
                                    sap.m.MessageToast.show(i18n.getText("semanticObjectDeleteSccsess"));

                                }.bind(this),
                                error: function(oResponse) {
                
                                }.bind(this)
                            });
                        }
                    }.bind(this)
                }) 
            },
            

        });
    });