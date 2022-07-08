sap.ui.define([
    "./BaseController",
    'sap/ui/model/json/JSONModel',  
	'sap/ui/model/FilterOperator',
	'sap/ui/model/Filter',
    'sap/m/StandardListItem'
], function (BaseController,JSONModel,FilterOperator,Filter,StandardListItem) {
    "use strict";

    return BaseController.extend("fiori.roles.controller.Details", {

        roleId: null,

        onInit: function () {
            BaseController.prototype.onInit.apply(this, arguments);

            this.getRouter().getRoute('Details').attachPatternMatched(this._onRouteMatch, this);
        },

        _onRouteMatch: function(oEvent) {
            this.roleId = oEvent.getParameter('arguments').path;
            var oViewModel = new JSONModel({
                isEdit: false,
                dialogValues: {
                    user: null,
                    group: null,
                    catalog: null
                }
            });

            this.getView().setModel(oViewModel, 'view');
            this.getView().bindElement("/Roles('" + this.roleId + "')", {
                parameters: {
                    expand: 'users,catalogs,groups'
                },
                events: {
                    dataRequested: (oEvent) => {
                        debugger;
                    }
                }
            });
        },

        onOpenInsertDialog: async function(oEvent) {
            var oSource = oEvent.getSource();
            var sDialogName = oSource.data('dialogName');
            var sListId = oSource.data('listId');
            var oBinding = this.byId(sListId).getBinding('items');
            var oBindingContext = oBinding.create({ roleId: this.roleId }, true, { groupId: sListId });
            var oDialog = await this.getDialog(sDialogName);

            oDialog.bindElement(oBindingContext.getPath());
            oDialog.open();
        },

        onInsert: function(oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = oSource.getParent();

            oDialog.close();
        },

        onDelete: function(oEvent) {
            var oSource = oEvent.getSource();
            var sListId = oSource.data('listId');
            var oSelectedItems = this.byId(sListId).getSelectedItems();
            var aPaths = oSelectedItems.map(function(oSelectedItem) { return oSelectedItem.getBindingContext().getPath(); });
            var oDeletetionPromise = this.models.remove.call(this, aPaths);

            oDeletetionPromise.then(() =>  sap.m.MessageToast.show('Entries have beed deleted successfull'));
        },

        onDeleteRole: function(oEvent) {
            var oBindingContext = this.getView().getBindingContext();
            var sPath = oBindingContext.getPath();
            var oDeletionPromise = this.models.remove.call(this, [sPath]);

            oDeletionPromise.then(function() {
                this.getRouter().navTo('Overview');
                sap.m.MessageToast.show('Role has beed deleted successfull');
            }.bind(this));
        },

        onCancel: function(oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = oSource.getParent();
            var sPath = oDialog.getBindingContext().getPath();

            this.models.resetChanges.call(this, [ sPath ], undefined, true);
            oDialog.close();
        },

        onEditRole: function(oEvent) {
            this.getView().getModel('view').setProperty('/isEdit', true);
        },

        onSaveRole: function(oEvent) {
            var oSubmitPromise = this.models.submitChanges.call(this);

            oSubmitPromise.then(() => this.getView().getModel('view').setProperty('/isEdit', false));
        },

        onCancelRole: function(oEvent) {
            this.models.resetChanges.call(this, undefined, true, true);
            this.getView().getModel('view').setProperty('/isEdit', false)
        },

        onSuggest: function (oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				aFilters.push(new Filter("ID", FilterOperator.StartsWith, sTerm));
			}

			oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
		}
    });
});
