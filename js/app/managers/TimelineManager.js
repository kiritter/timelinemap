(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.TimelineManager = class TimelineManager {
        constructor(gaChannel, mapBoth, globalState, myChannel) {
            this.mapLeft = mapBoth.mapLeft;
            this.globalState = globalState;
            this.myChannel = myChannel;


            this.currentManager = new MyApp.MarkerCurrentManager(null, mapBoth, globalState);
            this.axisManager = new MyApp.MarkerAxisManager(null, mapBoth, globalState);
            this.periodManager = new MyApp.MarkerPeriodManager(null, mapBoth, globalState);
            this.secondPeriodManager = new MyApp.MarkerSecondPeriodManager(null, mapBoth, globalState);
            this.stationManager = new MyApp.MarkerStationManager(null, mapBoth, globalState);
            this.eventManager = new MyApp.MarkerEventManager(null, mapBoth, globalState);
            this.eventArtManager = new MyApp.MarkerEventArtManager(null, mapBoth, globalState);
            this.volcanoManager = new MyApp.MarkerVolcanoManager(null, mapBoth, globalState);
            this.globalEventManager = new MyApp.MarkerGlobalEventManager(null, mapBoth, globalState);

            this.pathManager = new MyApp.PathManager(mapBoth, globalState, this.periodManager, this.stationManager, this.secondPeriodManager);
            this.secondPathManager = new MyApp.SecondPathManager(mapBoth, globalState, this.secondPeriodManager, this.stationManager, this.periodManager);
        }

        async init() {
            await this._initAll();
            this.secondPathManager.draw();
            this.pathManager.draw();

            this.currentManager.initAdd();
            this.axisManager.initAdd();
            this.periodManager.initAdd();
            this.secondPeriodManager.initAdd();
            this.stationManager.initAdd();
            this.eventManager.initAdd();
            this.eventArtManager.initAdd();
            this.volcanoManager.initAdd();
            this.globalEventManager.initAdd();

            this.settingMyChannel(this.myChannel);
        }

        async _initAll() {
            var promiseList = [];

            var isInitAdd = false;
            promiseList.push(this.currentManager.init(isInitAdd));
            promiseList.push(this.axisManager.init(isInitAdd));
            promiseList.push(this.periodManager.init(isInitAdd));
            promiseList.push(this.secondPeriodManager.init(isInitAdd));
            promiseList.push(this.stationManager.init(isInitAdd));
            promiseList.push(this.eventManager.init(isInitAdd));
            promiseList.push(this.eventArtManager.init(isInitAdd));
            promiseList.push(this.volcanoManager.init(isInitAdd));
            promiseList.push(this.globalEventManager.init(isInitAdd));

            promiseList.push(this.pathManager.init());
            promiseList.push(this.secondPathManager.init());

            await Promise.all(promiseList);
        }

        settingMyChannel(myChannel) {
            var self = this;
            var topicName = MyApp.globalConst.TopicName.switchedTimeRange;
            myChannel.subscribe(topicName, function(topicName, options) {
                var selectedTimeRangeType = options.selectedTimeRangeType;

                self.secondPathManager.redraw();
                self.pathManager.redraw();

                self.currentManager.redraw(selectedTimeRangeType);
                self.axisManager.redraw(selectedTimeRangeType);
                self.periodManager.redraw(selectedTimeRangeType);
                self.secondPeriodManager.redraw(selectedTimeRangeType);
                self.stationManager.redraw(selectedTimeRangeType);
                self.eventManager.redraw(selectedTimeRangeType);
                self.eventArtManager.redraw(selectedTimeRangeType);
                self.volcanoManager.redraw(selectedTimeRangeType);
                self.globalEventManager.redraw(selectedTimeRangeType);
            });
        }

    };

}(this));
