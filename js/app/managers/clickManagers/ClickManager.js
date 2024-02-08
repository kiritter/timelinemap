(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.ClickManager = class ClickManager {
        constructor(mapBoth) {
            this.mapLeft = mapBoth.mapLeft;
            this.coreLeft = new MyApp.ClickManagerCore(mapBoth.mapLeft, 'left');
        }

        init() {
            this.coreLeft.init();
        }

        getCoreLeft() {
            return this.coreLeft;
        }

    };

}(this));
