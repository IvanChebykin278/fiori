sap.ui.define([
	"sap/ui/Device", 
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"./BaseController",
	'sap/m/IconTabBar',
	"sap/ui/core/routing/Router"

], function (Device, Filter, FilterOperator, JSONModel, BaseController, IconTabBar) {
	"use strict";

	

	return BaseController.extend("fiori.designer.controller.Master", {
		
		onInit : function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("CatalogsDetails").attachPatternMatched(this.changeTabCatalogs, this);
			oRouter.getRoute("GroupsDetails").attachPatternMatched(this.changeTabGroups, this);  
		},
		
		changeTabCatalogs: function(oEvent) {
			this.getView().byId("myTabContainer").setSelectedKey("Catalogs");
		},

		changeTabGroups: function(oEvent) {
			this.getView().byId("myTabContainer").setSelectedKey("Groups");
		},

		onTabSelected: function(oEvent) {
			var oItem = oEvent.getParameter("item");
			this.sTabKey = oItem.getProperty("key");
			// this.onUpdateFinished(this.sTabKey);

			this.getRouter().navTo(`${this.sTabKey}Details`) 
		},

		onPressAdd: function(){

		},

		
	});
})
