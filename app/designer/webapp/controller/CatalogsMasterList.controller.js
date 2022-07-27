sap.ui.define( [
	"sap/ui/core/mvc/Controller", 
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"./BaseController"], 
	
	function (Controller, Device, Filter, FilterOperator, BaseController) {
	"use strict";

	return Controller.extend("fiori.designer.controller.CatalogsMasterList", {

		sTabKey: "Catalogs",

		onInit : function () {
			// this.getOwnerComponent().getRouter().getRoute("CatalogsDetails").attachPatternMatched(this._onRouteMatched, this);
		},
		// _onRouteMatched: function(oEvent) {
		// 	/*
		// 	* Navigate to the first item by default only on desktop and tablet (but not phone).
		// 	* Note that item selection is not handled as it is
		// 	* out of scope of this sample
		// 	*/
		// 	if (!Device.system.phone) {
		// 		this.getOwnerComponent().getRouter()
		// 			.navTo("CatalogsDetails", {ID: 0}, true);
		// 	}
		// },
		onUpdateFinished : function(sTabKey){
			var firstItem = this.getView().byId(`idListCatalogs`).getItems()[0];   
			this.getView().byId(`idListCatalogs`).setSelectedItem(firstItem,true);
			var oSelectedData = firstItem.getBindingContext().getProperty();
            var sCatalogId = firstItem.getBindingContext().getProperty("ID");
            var sPath = firstItem.getBindingContext().getPath();
            this.getOwnerComponent().getModel("selectedItem").setProperty("/selectedItem", {
                    data: oSelectedData,
                    bindingContextPath: sPath,
                    isSelected: true
			});
			this.getOwnerComponent().getRouter()
				.navTo("CatalogsDetails",
					{ID:sCatalogId},
					!Device.system.phone);

		},

		onSelectionChange: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("listItem");
			var oSelectedData = oSelectedItem.getBindingContext().getProperty();
			var sPath = oSelectedItem.getBindingContext().getPath();
			var sCatalogId = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("ID");
			this.getOwnerComponent().getModel("selectedItem").setProperty("/selectedItem", {
				data: oSelectedData,
				bindingContextPath: sPath,
				isSelected: true
		});
			this.getOwnerComponent().getRouter()
				.navTo("CatalogsDetails",
					{ID:sCatalogId},
					!Device.system.phone);
		},
		onSearch: function (oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				aFilters = [ new Filter({
					filters: [
						new Filter({
							path: 'title',
							operator: FilterOperator.Contains,
							value1: sQuery
						}),
						new Filter({
							path: 'ID',
							operator: FilterOperator.Contains,
							value1: sQuery
						})
					],
					or: true
				})]

			
			};

			// update list binding
			var oList = this.byId(`idList${this.sTabKey}`);
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters);
		}
	});
});
