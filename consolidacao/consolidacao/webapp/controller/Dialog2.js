sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(ManagedObject, MessageBox, Utilities, History) {

	return ManagedObject.extend("com.sap.build.standard.consolidado.controller.Dialog2", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.consolidado.view.Dialog2", this);
			this._bInit = false;
		},

		exit: function() {
			delete this._oView;
		},

		getView: function() {
			return this._oView;
		},

		getControl: function() {
			return this._oControl;
		},

		getOwnerComponent: function() {
			return this._oView.getController().getOwnerComponent();
		},

		open: function() {
			var oView = this._oView;
			var oControl = this._oControl;

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}

			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},

		close: function() {
			this._oControl.close();
		},

		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function() {
			return {};

		},
		_onButtonPress: function(oEvent) {
            var oModel = this.getView().getModel();
            var oListBinding = oModel.bindList("/WO", undefined, undefined, undefined, { $$updateGroupId: "woGroup" });
            var that = this;
            var oGlobalBusyDialog = new sap.m.BusyDialog();
            oGlobalBusyDialog.open();
            sap.ui.getCore().getMessageManager().removeAllMessages();
            oListBinding.attachCreateCompleted(function (oEvent) {
                    oGlobalBusyDialog.close();
                    if (oEvent.getParameter("success")) {
                        MessageBox.show(
                            "Dados atualizados com sucesso", {
                            icon: MessageBox.Icon.SUCCESS,
                            title: "Dados gravados!",
                            onClose: function (oAction) {
                                var oTable = that.getView().byId("woTable"),
                                    oBinding = oTable.getBinding("items"),
                                    aFilters = [];
                                oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                                oBinding.filter(aFilters);
                                that.close();
                            }
                        }
                        );
                    } else {
                        sap.m.MessageBox.show(
                            sap.ui.getCore().getMessageManager().getMessageModel().getData()[0].message,
                            sap.m.MessageBox.Icon.ERROR,
                            "Erro ao efetuar baixa"
                        );
                        oListBinding.resetChanges();
                        //sap.ui.getCore().getMessageManager().removeAllMessages();
                    }
                }.bind(this));
                var woValue = this.getView().byId("woValue").getValue();
                var dateValue = this.getView().byId("woDateValue").getValue();
                var oContext = oListBinding.create({
                    "apptID": woValue,
                    "dateFrom": dateValue
                }, true);
                this.getView().getModel().submitBatch("woGroup");
            //	var oBindingContext = oEvent.getSource().getBindingContext();

		//	return new Promise(function(fnResolve) {

		//		this.doNavigate("Page2", oBindingContext, fnResolve, "");
		//	}.bind(this)).catch(function(err) {
		//		if (err !== undefined) {
		//			MessageBox.error(err.message);
		//		}
		//	});

		},
		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		_onButtonPress1: function() {

			this.close();

		},
		onInit: function() {

			this._oDialog = this.getControl();

		},
		onExit: function() {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);
