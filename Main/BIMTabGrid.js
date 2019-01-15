/*================================================================================================================================================
Copyright (c) 2008-2015 by BIMiner Technologies Inc, All rights reserved.
Description:
Revisions: Initialized 2017-2-22
=================================================================================================================================================*/


var app = -1;

/**
* Function: toolBar
*/
function toolBar(e) {

    rm.editDoGrids();
    rm.postGrids();
    if (e == "Find")
        rm.find(500);   // 500 is the width, generalize later
    else
        toolBarCommon(e);
}

/**
* Function: print
*/
function print(title, rn) {
	parent.fm.add(title, 'BIMReport.aspx?rn=' + rn + '&id=' + formShuttle.IDCurrent);
}

/**
* Function: doResize
* Callback function called by {BIMiner.ResizerShell}
*/
function doResize() {
    resizeIFrame(window.frameElement);
    resizeTab($get(vf0));
    rm.resizeGrids();
}

/**
* Function: pageUnload
*/
function pageUnload() {
    rm.editDisposeGrids();
}

/**
* Function: pageLoad
*/
function pageLoad() {
    if (app == -1) 
        app = $BIMCommon.queryString("ID");

    rm = new BIMiner.FormManager();
    rm.initialize();

    rs = $create(BIMiner.ResizerShell, {}, null, null, null);
    window.onresize = function() { rs.resize(); }

    setTabContentWidth();

	popupMsgVerify("Verify Result", "VerifySuccess:", "VerifyFailed:", 480);

    rm.pageLoaded();
}
