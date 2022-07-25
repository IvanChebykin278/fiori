sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/library"
],  function (BaseController, JSONModel, MessageBox, library) {
        "use strict";

        return BaseController.extend("fiori.semanticobjects.controller.Overview", {

            onInit: function () {

                BaseController.prototype.onInit.apply(this,arguments);

                var oData = {
                    selectedSemanticObject: {
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
                var oBindingContext = oSelectedItem.getBindingContext();
                var oSelectedProperty = oBindingContext.getProperty();
                var sSelectedPath = oBindingContext.getPath();

                this.getModel("view").setProperty("/selectedSemanticObject", {
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
                var sDialogName = oEvent.getSource().data('dialogName');
                var oDialog = await this.getDialog(sDialogName);
                var sPath =  this.getModel("view").getProperty("/selectedSemanticObject/bindingContextPath");

                oDialog.bindElement(sPath);
                oDialog.open();
            },

            onCancel: function(oEvent) {
                var oSource = oEvent.getSource();
                var oDialog = oSource.getParent();
                var sPath = oDialog.getBindingContext().getPath();
    
                this.getModel().resetChanges();
                this.getModel().refresh(true);
                oDialog.close();
            },

            _changeSemanticObjectEntity : function(oEvent, sMessage){
                var oSource = oEvent.getSource();
                var oDialog = oSource.getParent();
                var oBindingContext = oDialog.getBindingContext();
                var oModel = oBindingContext.getModel();
                var semanticObjectInsertSccsess = this.getResourceBundle().getText(sMessage);

                this.getModel().submitChanges({
                    success: function(oResponse) {

                        var aMessages = oModel.getMessages(oBindingContext);

                        var bIsError = aMessages.reduce(function(result, oMessage){

                            var isCorrectTarget = oMessage.getTarget() === oBindingContext.getPath() + "/semanticObject";
                            var isError = oMessage.getType() === library.MessageType.Error;

                            return (isCorrectTarget && isError) || result;

                        }, false);

                        if (!bIsError){
                            sap.m.MessageToast.show(semanticObjectInsertSccsess);
                            oDialog.close();
                        }

                        
                    }.bind(this),
                    error: function(oResponse) {
                        //Должен вылетать месседж тоаст с ошибкой
                        // oResponse.message.value
                        
                    }.bind(this)
                });
            },

            onInsert: function(oEvent) {
                this._changeSemanticObjectEntity(oEvent, "semanticObjectInsertSccsess");
            },

            onEdit: function(oEvent) {
                this._changeSemanticObjectEntity(oEvent, "semanticObjectEditedSccsess");
            },


            onDeleteDialog : function(oEvent){
                
                var sPath =  this.getModel("view").getProperty("/selectedSemanticObject/bindingContextPath");
                var sWarningMessage = this.getResourceBundle().getText("deletSematicObjectMessageBoxTitile");
                var sSemanticObjectDeleteSccsess = this.getResourceBundle().getText("semanticObjectDeleteSccsess");
            
                MessageBox.warning(sWarningMessage, {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,

                    onClose: function (sAction) {
                        if (sAction === "OK"){

                            this.getModel().remove(sPath, {
                                success: function(oResponse) {
            
                                    sap.m.MessageToast.show(sSemanticObjectDeleteSccsess);
                                    this._removeSelection();

                                }.bind(this),
                                error: function(oResponse) {
                                    //Должен вылетать месседж тоаст с ошибкой
                                    //oResponse.message.value
                                    this.getModel().refresh(true);
                                }.bind(this)
                            });
                        }
                    }.bind(this)
                }) 
            },
            
            _removeSelection : function(){
                this.getView().byId("semanticObjectsTable").removeSelections(true);
                this.getModel("view").setProperty("/selectedSemanticObject", {
                    data: null,
                    bindingContextPath: null,
                    isSelected: false
                });
            }

        });
    });