sap.ui.define( [
	"sap/ui/core/mvc/Controller", 
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], 
	
	function (Controller, Device, Filter, FilterOperator, BaseController, JSONModel) {
	"use strict";

	return Controller.extend("fiori.designer.controller.CatalogsMasterList", {

		sTabKey: "Catalogs",

		onInit : function () {
			var oList = this.byId(`idList${this.sTabKey}`),
                    // Put down master list's original value for busy indicator delay,
                    // so it can be restored later on. Busy handling on the master list is
                    // taken care of by the master list itself.
                iOriginalBusyDelay = oList.getBusyIndicatorDelay();
                this._oList = oList;
                // keeps the filter and search state
                this._oListFilterState = {
                    aFilter: [],
                    aSearch: [],
                };
                // this.getOwnerComponent().setModel(oViewModel, "masterView");
                // Make sure, busy indication is showing immediately so there is no
                // break after the busy indication for loading the view's meta data is
                // ended (see promise 'oWhenMetadataIsLoaded' in AppController)
                oList.attachEventOnce("updateFinished", function () {
                    // Restore original busy indicator delay for the list
                    this.getOwnerComponent().getModel("selectedItem").setProperty("/delay", iOriginalBusyDelay);
                });
                this.getView().addEventDelegate({
                    onBeforeFirstShow: function () {
                        this.getOwnerComponent().oListSelectorCatalogs.setBoundMasterList(oList);
                    }.bind(this),
                });
                this.getOwnerComponent().getRouter()
                    .getRoute("CatalogsDetails")
                    .attachPatternMatched(this._onMasterMatched, this);
                this.getOwnerComponent().getRouter().attachBypassed(this.onBypassed, this);

                this._RefreshParams = {
                    doNav: false,
                    MsgNavigation: "",
                };

                this._FragmentsAdded = {};
		},

		onUpdateFinished : function(oEvent){
			// var firstItem = this.getView().byId(`idListCatalogs`).getItems()[0];   
			// this.getView().byId(`idListCatalogs`).setSelectedItem(firstItem,true);
			// var oSelectedData = firstItem.getBindingContext().getProperty();
            // var sCatalogId = firstItem.getBindingContext().getProperty("ID");
            // var sPath = firstItem.getBindingContext().getPath();
            // this.getOwnerComponent().getModel("selectedItem").setProperty("/selectedItem", {
            //         data: oSelectedData,
            //         bindingContextPath: sPath,
            //         isSelected: true
			// });
			// this.getOwnerComponent().getRouter()
			// 	.navTo("CatalogsDetails",
			// 		{ID:sCatalogId},
			// 		!Device.system.phone);
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
			// hide pull to refresh if necessary
			// this.byId("pullToRefresh").hide();
			// this._doNavigate();
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
			
			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},

		_showDetail: function (oItem) {
			var bReplace = !Device.system.phone;
			this.getOwnerComponent().getRouter().navTo(
				"CatalogsDetails",
				{
					ID: oItem.getBindingContext().getProperty("MessageId"),
				},
				bReplace
			);
		},

		_updateListItemCount: function (iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = iTotalItems;
				this.getOwnerComponent().getModel("selectedItem").setProperty("/totalItems", sTitle);
			}
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
		},

		_onMasterMatched: function () {
			this.getOwnerComponent().oListSelectorCatalogs.oWhenListLoadingIsDone.then(
				function (mParams) {
					if (mParams.list.getMode() === "None") {
						return;
					}
					var sCatalogId = mParams.firstListitem
						.getBindingContext()
						.getProperty("MessageId");
						this.getOwnerComponent().getRouter()
						.navTo("CatalogsDetails",
							{ID:sCatalogId},
							!Device.system.phone);
		
				}.bind(this),
				function (mParams) {
					if (mParams.error) {
						return;
					}
					this.getRouter().getTargets().display("detailNoObjectsAvailable");
				}.bind(this)
			);
		},
	});
});
