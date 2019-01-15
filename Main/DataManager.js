
/*================================================================================================================================================
Copyright (c) 2008-2015 by BIMiner Technologies Inc, All rights reserved.
Description: manage DataShuttle which shuttles between client and server
Revisions: Initialized 2017-2-22
=================================================================================================================================================*/

var DataManager = function() {
    this._ds = null; // data shuttle 
    this.initialize();
};

DataManager.prototype = $.extend(DataManager.prototype, {
    initialize: function() { },

    dispose: function() { },

    /*======= DataShuttle ============================================================*/

    /**
    * Function: setDataShuttle
    * set DataShuttle, deserialize into this._ds
    */
    setDataShuttle: function() {
        if (formShuttle.DataShuttle == null || formShuttle.DataShuttle == '') return;
        this._ds = eval('(' + formShuttle.DataShuttle + ')');
    },

    /**
    * Function: getDataShuttle
    * get DataShuttle
    */
    getDataShuttle: function() {
        return this._ds;
    },

    /*======= Get ============================================================*/

    /**
    * Function: getValue
    * get value by element id
    * Parameters:
    * id - element id 
    */
    getValue: function(id) {
        var affix = $BIMCommon.parseFieldAffix(id);
        var prefix = $BIMCommon.parseFieldPrefix(id);
        var fieldName = $BIMCommon.parseFieldName(id);

        var ret = "";
        if (this._ds && affix == 'PVA') {
            var ti = this._getTableIndex(this._ds.PivotTable);
            var ci = this._getColumnIndex(ti, fieldName);
            ret = this._getValue(ti, ci, 0);
        }

        return ret;
    },

    /**
    * Function: getValueByPKAndCol
    * get value by PK and column name
    * Parameters:
    * tableName - table name
    * pkColName - primary key column name
    * pkValue - primanry key value
    * colName - column name 
    */
    getValueByPKAndCol: function(tableName, pkColName, pkValue, colName) {
        var ti = this._getTableIndex(tableName);
        var ci = this._getColumnIndex(ti, pkColName);
        var ri = this._getRowIndexByColumnValue(ti, ci, pkValue);
        var ci1 = this._getColumnIndex(ti, colName);
        return this._getValue(ti, ci1, ri);
    },

    /**
    * Function: _getTableIndex
    * get table index
    * Parameters:
    * tn - table name 
    */
    _getTableIndex: function(tn) {
        var ret = -1;
        for (var i = 0; i < this._ds.TableName.length; i++)
            if (this._ds.TableName[i] == tn) return i;
        return ret;
    },

    /**
    * Function: _getColumnIndex
    * get column index
    * Parameters:
    * ti - table index
    * cn - column name 
    */
    _getColumnIndex: function(ti, cn) {
        var ret = -1;
        for (var i = 0; i < this._ds.TableColumn[ti].length; i++)
            if (this._ds.TableColumn[ti][i] == cn) return i;
        return ret;
    },

    /**
    * Function: _getRowIndexByColumnValue
    * get row index by column value
    * Parameters:
    * ti - table index
    * ci - column index
    * v - value in the row and column 
    */
    _getRowIndexByColumnValue: function(ti, ci, v) {
        var ret = -1;
        for (var i = 0; i < this._ds.TableData[ti][ci].length; i++)
            if (this._ds.TableData[ti][ci][i] == v) return i;
        return ret;
    },

    /**
    * Function: _getValue
    * get value from this._ts.TableData
    * Parameters:
    * ti - table index 
    * ci - column index 
    * ri - ri index 
    */
    _getValue: function(ti, ci, ri) {
        if (ti < 0 || ci < 0 || ri < 0) return "";

        return this._ds.TableData[ti][ci][ri];
    },


    /*======= Set ============================================================*/

    /**
    * Function: setValue
    * set dat from UI into proper table
    * Parameters:
    * id - element id 
    * v - value 
    * 
    */
    setValue: function(id, v) {
        var affix = $BIMCommon.parseFieldAffix(id);
        var prefix = $BIMCommon.parseFieldPrefix(id);
        var fieldName = $BIMCommon.parseFieldName(id);

        var ret = "";
        if (this._ds && affix == 'PVA') {
            var ti = this._getTableIndex(this._ds.PivotTable);
            this._ds.TableColumn[ti].push(fieldName);
            this._ds.TableData[ti].push(new Array(v));
        }
    },

    /*======= Clean ============================================================*/

    /**
    * Function: cleanDataShuttle
    * clean this._ds to be ready for accept UI data
    */
    cleanDataShuttle: function() {
        if (this._ds == null) return;

        // For theme table, wipe the value
        var ti = this._getTableIndex(this._ds.ThemeTable);
        for (var i = 0; i < this._ds.TableData[ti].length; i++)
            this._ds.TableData[ti][i][0] = "";

        // For pivot table, wipe the column too
        var ti1 = this._getTableIndex(this._ds.PivotTable);
        this._ds.TableColumn[ti1] = new Array();
        this._ds.TableData[ti1] = new Array;

        // For other tables, delete rows
        for (var i = 0; i < this._ds.TableData.length; i++) {
            if (i == ti || i == ti1) continue;
            for (var j = 0; j < this._ds.TableData[i].length; j++)
                this._ds.TableData[i][j] = new Array();
        }
    }
});