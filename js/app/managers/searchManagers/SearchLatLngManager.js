(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.SearchLatLngManager = class SearchLatLngManager {
        constructor(gaChannel, mapBoth, clickManager) {
            this.coreLeft = new MyApp.SearchLatLngManagerCore(gaChannel, mapBoth.mapLeft, 'left', clickManager.getCoreLeft());
        }

        init() {
            this.coreLeft.init();
        }

    };

}(this));
