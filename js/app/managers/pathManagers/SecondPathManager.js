(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.SecondPathManager = class SecondPathManager {
        constructor(mapBoth, globalState, periodManager, stationManager, otherPeriodManager) {
            this.layerName = 'second_path';
            this.coreManager = new MyApp.LineCoreManager(mapBoth, globalState, this.layerName, periodManager, stationManager, otherPeriodManager);
        }

        async init() {
            await this.coreManager.init();
        }

        draw() {
            this.coreManager.draw();
        }

        redraw() {
            this.coreManager.redraw();
        }

    };

}(this));
