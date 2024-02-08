(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.globalConst = {
        DataType: {
            AXIS: 1,
            PERIOD: 2,
            STATION: 3,
            EVENT: 4,
            GLOBAL_event: 9,
        },
        TopicName: {
            switchedTimeRange: 'switchedTimeRange',
        },
    };

}(this));
