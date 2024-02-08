(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.globalState = {
        hasIndexedDbApi: false,
        timeRangeType: 1,
    };

    MyApp.globalState.const = {
        TIME_RANGE_TYPE_YUSHI: 1,
        TIME_RANGE_TYPE_JOMON: 2,
        TIME_RANGE_TYPE_SEKKI: 3,
        TIME_RANGE_TYPE_EARTH: 9,
    };

}(this));
