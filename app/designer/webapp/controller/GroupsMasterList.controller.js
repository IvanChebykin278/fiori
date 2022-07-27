sap.ui.define( [
	"sap/ui/core/mvc/Controller", 
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"./BaseController"], 
	
	function (Controller, Device, Filter, FilterOperator, BaseController){
    
    "use strict";

	return Controller.extend("fiori.designer.controller.GroupsMasterList", {

        sTabKey : "Groups",

		onInit : function () {
			// this.getOwnerComponent().getRouter().getRoute("GroupsDetails").attachPatternMatched(this._onRouteMatched, this);
		},
		// _onRouteMatched: function(oEvent) {
		// 	if (!Device.system.phone) {
		// 		this.getOwnerComponent().getRouter()
		// 			.navTo("GroupsDetails", {ID: 0}, true);
		// 	}
		// },

        onUpdateFinished : function(sTabKey){
			var firstItem = this.getView().byId(`idListGroups`).getItems()[0];   
			this.getView().byId(`idListGroups`).setSelectedItem(firstItem,true);
			var oSelectedData = firstItem.getBindingContext().getProperty();
            var sGroupId = firstItem.getBindingContext().getProperty("ID");
            var sPath = firstItem.getBindingContext().getPath();
            this.saveSelectionAndRouting(oSelectedData, sPath, sGroupId);

		},

		onSelectionChange: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("listItem");
			var oSelectedData = oSelectedItem.getBindingContext().getProperty();
			var sPath = oSelectedItem.getBindingContext().getPath();
			var sGroupId = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("ID");
			this.saveSelectionAndRouting(oSelectedData, sPath, sGroupId);
		},

        saveSelectionAndRouting: function(data, path, ID){
            this.getOwnerComponent().getModel("selectedItem").setProperty("/selectedItem", {
				data: data,
				bindingContextPath: path,
				isSelected: true
		});
			this.getOwnerComponent().getRouter()
				.navTo("GroupsDetails",
					{ID:ID},
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
