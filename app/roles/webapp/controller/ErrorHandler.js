sap.ui.define(
    ["sap/ui/base/Object", "sap/m/MessageBox"],
    function (UI5Object, MessageBox) {
      "use strict";
  
      return UI5Object.extend("fiori.roles.controller.ErrorHandler", {
  
        constructor: function (oComponent) {
            this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
            this._oComponent = oComponent;
            this._oModel = oComponent.getModel();
            this._bMessageOpen = false;
            this._sErrorText = this._oResourceBundle.getText("errorText");
  
            this._oModel.attachMetadataFailed(function (oEvent) {
              var oParams = oEvent.getParameters();
              
              this.showServiceError(oParams.response);
            }, this);
  
            this._oModel.attachRequestFailed(function (oEvent) {
              var oParams = oEvent.getParameters();
            }, this);
        },
  
        /**
         * Shows a {@link sap.m.MessageBox} when a service call has failed.
         * Only the first error message will be display.
         * @param {string} sDetails a technical error to be displayed on request
         * @private
         */
        showServiceError: function (sDetails) {
          if (this._bMessageOpen) {
            return;
          }
          this._bMessageOpen = true;
          MessageBox.error(this._sErrorText, {
            id: "serviceErrorMessageBox",
            details: sDetails,
            styleClass: this._oComponent.getContentDensityClass(),
            actions: [MessageBox.Action.CLOSE],
            onClose: function () {
              this._bMessageOpen = false;
            }.bind(this),
          });
        },
      });
    }
  );
  