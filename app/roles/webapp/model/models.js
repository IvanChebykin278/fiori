sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/m/MessageBox"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device, MessageBox) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            remove: function(aPaths) {
                return new Promise((resolve, reject) => {
                    MessageBox.show(
                        "Do you sure that you want to delete entry/entries?", {
                            icon: MessageBox.Icon.INFORMATION,
                            title: "Delete",
                            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                            emphasizedAction: MessageBox.Action.YES,
                            onClose: oAction => {
                                if(oAction === MessageBox.Action.YES) {
                                    var aPromises = aPaths.map((sPath) => {
                                        return new Promise((resolve, reject) => {
                                            this.getModel().remove(sPath, {
                                                success: (oResponse) => resolve(oResponse),
                                                error: (oResponse) => reject(oResponse)
                                            });
                                        });
                                    });
                    
                                    Promise.all(aPromises).then(() => resolve(false)).catch(e => reject(e));
                                } else {
                                    resolve(true);
                                }
                            }
                        }
                    );
                });
            },

            submitChanges: function(oParameters) {
                return new Promise((resolve, reject) => {
                    var oModel = this.getModel();

                    if(oModel.hasPendingChanges()) {
                        oModel.submitChanges({
                            groupId: oParameters ? oParameters.groupId : undefined,
                            success: oResponse => {
                                resolve(oResponse);
                            },
                            error: oResponse => reject(oResponse)
                        });
                    } else {
                        resolve();
                    }
                });
            },

            resetChanges: function() {
                var oModel = this.getModel();

                if(oModel.hasPendingChanges()) {
                    oModel.resetChanges.apply(oModel, arguments);
                }
            }
        };
});