/*================================================================================================================================================
Copyright (c) 2008-2015 by BIMiner Technologies Inc, All rights reserved.
Description: 1. encapsulate jQuery ajax(), such as cache = false
             2. entend jQuery ajax(), such as provides affected elements to explicitly dispose properly 
Revisions: Initialized 2017-2-22
=================================================================================================================================================*/


//var qs = $.param(es);
//var url = "/BIMHandler.ashx?r=" + encodeURIComponent(es);

var RequestManager = function() {
	this._cache = false;
	this._url = "/BIMHandler.ashx";
	this.initialize();
};

RequestManager.prototype = $.extend(RequestManager.prototype, {
	initialize: function() {
	},

	dispose: function() {
	},

	request: function(para, url) {
		var urlWithPara = (url == null ? this._url : url) + "?r=" + encodeURIComponent(JSON.stringify(para.data));
		$.ajax({ url: urlWithPara, success: para.success });
	}
});