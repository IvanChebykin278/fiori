sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/library"
],  function (BaseController, JSONModel, MessageBox, library) {
        "use strict";

        return BaseController.extend("fiori.semanticobjects.controller.Overview", {

            onInit: function () {
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
    
                this.getModel().resetChanges([ sPath ], undefined, true);
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

                        // (function recursion (array,index){
                        //     var item = array[index];
                        //     var test = oResponse;
                        //     if (!item){
                        //         sap.m.MessageToast.show(semanticObjectInsertSccsess);
                        //         return;
                        //     };
                        //     if (item.__changeResponses && Array.isArray(item.__changeResponses)){
                        //         return recursion.call(this, item.__changeResponses,0);    
                        //     };
                        //     if (item.response && item.response.statusCode && item.response.statusCode.indexOf('2') != 0 ){
                        //         this.getModel().resetChanges();
                        //         return
                        //     };
                        //     recursion.call(this, array,index+1);
                        // }.bind(this))(oResponse.__batchResponses,0); 
                        
                        // oDialog.close();
                        // //Возникает ошибка, если есть рефреш
                        // this.getModel().refresh();
                        // this._removeSelection();

                        // var oMessageManager = sap.ui.getCore().getMessageManager();
                        // var oModel = this.getModel();
                        // var aMessages = oModel.getMessages(oDialog.getBindingContext());

                        // oMessageManager.addMessages(aMessages);

                        var aMessages = oModel.getMessages(oBindingContext);

                        for(var oMessage in aMessages) {
                            var isCorrectTarget = oMessage.getTarget() === oBindingContext.getPath() + "/semanticObject";
                            var isError = oMessage.getType() === library.MessageType.Error;

                            if(isCorrectTarget && isError) {
                                return;
                            }
                        }
                        
                        sap.m.MessageToast.show(semanticObjectInsertSccsess);
                        oDialog.close();

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