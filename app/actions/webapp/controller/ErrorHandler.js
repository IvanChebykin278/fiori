sap.ui.define(
    ["sap/ui/base/Object", "sap/m/MessageBox"],
    function (UI5Object, MessageBox) {
      "use strict";

      return UI5Object.extend("fiori.semanticobjects.controller.ErrorHandler", {

        constructor: function (oComponent) {
            this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
            this._oComponent = oComponent;
            this._oModel = oComponent.getModel();
            this._bMessageOpen = false;
            this._sErrorText = this._oResourceBundle.getText("errorText");

            this._oModel.attachMetadataFailed(function (oEvent) {
              var oParams = oEvent.getParameters();

              this.showServiceError(oParams.response, oParams.response.message);

              sap.ui.core.BusyIndicator.hide();
            }, this);

            // this._oModel.attachRequestFailed(function (oEvent) {
            //   var oParams = oEvent.getParameters();
            //   var vResponseText;

            //   try {
            //     vResponseText = JSON.parse(oParams.response.responseText).error;
            //   } catch {
            //     vResponseText = oParams.response.message;
            //   }

            //   // An entity that was not found in the service is also throwing a 404 error in oData.
            //   // We already cover this case with a notFound target so we skip it here.
            //   // A request that cannot be sent to the server is a technical error that we have to handle though
            //   if (
            //     oParams.response.statusCode !== "404" ||
            //     (oParams.response.statusCode === 404 &&
            //       oParams.response.responseText.indexOf("Cannot POST") === 0)
            //   ) {
            //     this.showServiceError(oParams.response.responseText, vResponseText.message ? vResponseText.message.value : vResponseText);
            //   }
              
            //   sap.ui.core.BusyIndicator.hide();
            // }, this);
        },

        /**
         * Shows a {@link sap.m.MessageBox} when a service call has failed.
         * Only the first error message will be display.
         * @param {string} sDetails a technical error to be displayed on request
         * @private
         */
        showServiceError: function (sDetails, errorMessage) {
          if (this._bMessageOpen) {
            return;
          }
          this._bMessageOpen = true;
          MessageBox.error(errorMessage, {
            id: "serviceErrorMessageBox",
            icon: sap.m.MessageBox.Icon.ERROR,
            title: this._sErrorText,
            details: sDetails,
            actions: [MessageBox.Action.CLOSE],
            onClose: function () {
              this._bMessageOpen = false;
            }.bind(this),
          });
        },
      });
    }
  );