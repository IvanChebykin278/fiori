sap.ui.define([
	"sap/ui/Device", 
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"./BaseController",
	'sap/m/TabContainerItem'
], function (Device, Filter, FilterOperator, JSONModel, BaseController, TabContainerItem) {
	"use strict";

	

	return BaseController.extend("fiori.designer.controller.Master", {
		
		sTabKey : "Catalogs",
		
		onInit : function () {

			BaseController.prototype.onInit.apply(this, arguments);

			var oData = {
                selectedCatalog: {
                    data: null,
                    bindingContextPath: null,
                    isSelected: false
                }
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "catalogSelection");
		},

		onSelectionChange: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oSelectedData = oSelectedItem.getBindingContext().getProperty();
            var sPath = oSelectedItem.getBindingContext().getPath();
            this.getModel("catalogSelection").setProperty("/selectedCatalog", {
                    data: oSelectedData,
                    bindingContextPath: sPath,
                    isSelected: true
            })
        },

		onItemSelected: function(oEvent) {
			var oItem = oEvent.getParameter("item");
			this.sTabKey = oItem.getProperty("key");
		},

		onSearch: function (oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("title", FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			};

			// update list binding
			var oList = this.byId(`idList${this.sTabKey}`);
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters);
		},
	});
})
