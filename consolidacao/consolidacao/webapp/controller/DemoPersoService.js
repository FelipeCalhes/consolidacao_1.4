sap.ui.define(["jquery.sap.global"], function (e) {
	"use strict";
	var r = {
		oData: {
			_persoSchemaVersion: "1.0",
			aColumns: [{
				id: "demoApp-productsTable-productCol",
				order: 2,
				text: "Product",
				visible: true
			}, {
				id: "demoApp-productsTable-supplierCol",
				order: 1,
				text: "Supplier",
				visible: true
			}, {
				id: "demoApp-productsTable-dimensionsCol",
				order: 0,
				text: "Dimensions",
				visible: false
			}, {
				id: "demoApp-productsTable-weightCol",
				order: 3,
				text: "Weight",
				visible: true
			}, {
				id: "demoApp-productsTable-priceCol",
				order: 4,
				text: "Price",
				visible: true
			}]
		},
		getPersData: function () {
			var r = new e.Deferred;
			if (!this._oBundle) {
				this._oBundle = this.oData
			}
			var t = this._oBundle;
			r.resolve(t);
			return r.promise()
		},
		setPersData: function (r) {
			var t = new e.Deferred;
			this._oBundle = r;
			t.resolve();
			return t.promise()
		},
		resetPersData: function () {
			var r = new e.Deferred;
			var t = {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "demoApp-productsTable-productCol",
					order: 0,
					text: "Product",
					visible: true
				}, {
					id: "demoApp-productsTable-supplierCol",
					order: 1,
					text: "Supplier",
					visible: false
				}, {
					id: "demoApp-productsTable-dimensionsCol",
					order: 4,
					text: "Dimensions",
					visible: false
				}, {
					id: "demoApp-productsTable-weightCol",
					order: 2,
					text: "Weight",
					visible: true
				}, {
					id: "demoApp-productsTable-priceCol",
					order: 3,
					text: "Price",
					visible: true
				}]
			};
			this._oBundle = t;
			r.resolve();
			return r.promise()
		},
		getCaption: function (e) {
			if (e.getHeader() && e.getHeader().getText) {
				if (e.getHeader().getText() === "Weight") {
					return "Weight (Important!)"
				}
			}
			return null
		},
		getGroup: function (e) {
			if (e.getId().indexOf("productCol") != -1 || e.getId().indexOf("supplierCol") != -1) {
				return "Primary Group"
			}
			return "Secondary Group"
		}
	};
	return r
});