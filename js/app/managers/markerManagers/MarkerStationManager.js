(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MarkerStationManager = class MarkerStationManager {
        constructor(gaChannel, mapBoth, globalState) {
            this.gaChannel = gaChannel;
            this.mapBoth = mapBoth;
            this.globalState = globalState;

            this.list = [
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_YUSHI, url: 'geojson/01_timelines/14a_station.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_JOMON, url: 'geojson/01_timelines/24a_station.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_SEKKI, url: 'geojson/01_timelines/34a_station.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_EARTH, url: 'geojson/01_timelines/94a_station.geojson'},
            ];

            this.coreManagerByKey = this._createCoreManagerMap();
        }

        _createCoreManagerMap() {
            var coreManagerByKey = new Map();
            var self = this;
            this.list.forEach((el) => {
                var coreManager = self._createCoreManager(el.timeRangeType, el.url);
                coreManagerByKey.set(`${el.timeRangeType}`, coreManager);
            });
            return coreManagerByKey;
        }
        _createCoreManager(targetTimeRangeType, targetUrl) {
            var layerName = 'station';
            var callbacks = {
                'tooltipContentCallback': MarkerStationManager._buildTooltipContent,
                'popupContentCallback': null,
            };
            var options = {
                shouldCircleMarker: true,
                circleMarkerColNames: {radius: 'circleMarkerRadius', color: 'circleMarkerColor', isFill: 'circleMarkerIsFill'},
                shouldTooltip: true,
                tooltipNames: {className: 'tooltip-station', geZoom: 'geZoom', direction: 'direction'},
                shouldPopup: false,
            };
            var coreManager = new MyApp.MarkerCoreManager(this.gaChannel, this.mapBoth, this.globalState, layerName, callbacks, options, targetTimeRangeType, targetUrl);
            return coreManager;
        }

        async init() {
            var promiseList = [];
            for (var [key, coreManager] of this.coreManagerByKey) {
                promiseList.push(coreManager.init());
            }
            await Promise.all(promiseList);
        }
        initAdd() {
            for (var [key, coreManager] of this.coreManagerByKey) {
                coreManager.initAdd();
            }
        }

        static _buildTooltipContent(properties) {
            var content;
            if (properties.typeId === MyApp.globalState.const.TIME_RANGE_TYPE_EARTH) {
                content = MarkerStationManager._buildTooltipContentForEarth(f, properties);
                return content;
            }

            var f = new Intl.NumberFormat('ja-JP');
            if (properties.year > 0) {
               content = MarkerStationManager._buildTooltipContentForAD(f, properties);
            }else{
               content = MarkerStationManager._buildTooltipContentForBC(f, properties);
            }
            return content;
        }

        static _buildTooltipContentForEarth(f, properties) {
            var year = properties.year;
            var dispYear = (year < 0) ? `${year*-1}億年前` : `${year}億年後`;
            dispYear = (year === 0) ? `現在` : dispYear;
            var content = `
<div>
    <div>
        <span>${dispYear}</span>
    </div>
    <div>${properties.stationName}</div>
    <div class="desc-content">${properties.desc}</div>
</div>
`;
            return content;
        }
        static _buildTooltipContentForAD(f, properties) {
            var year = (-9999 <= properties.year && properties.year <= 9999) ? properties.year : f.format(properties.year);
            var content = `
<div>
    <div>
        <span>西暦${year}年</span>
    </div>
    <div>${properties.stationName}</div>
    <div class="desc-content">${properties.desc}</div>
</div>
`;
            return content;
        }
        static _buildTooltipContentForBC(f, properties) {
            var year = (-9999 <= properties.year && properties.year <= 9999) ? properties.year : f.format(properties.year);
            var zenYear = (-9999 <= properties.year && properties.year <= 9999) ? (properties.year - 1) * -1 : f.format((properties.year - 1) * -1);
            var content = `
<div>
    <div>
        <span>前${zenYear}年</span>(<span>西暦${year}年)</span>
    </div>
    <div>${properties.stationName}</div>
    <div class="desc-content">${properties.desc}</div>
</div>
`;
            return content;
        }
        static _buildPopupContent(properties) {
            var content = '';
            return content;
        }

        getPathInfoList() {
            var currentTimeRangeType = this.globalState.timeRangeType;
            var targetCoreManager = this.coreManagerByKey.get(`${currentTimeRangeType}`);
            return targetCoreManager.getPathInfoList();
        }

        redraw(selectedTimeRangeType) {
            for (var [key, coreManager] of this.coreManagerByKey) {
                coreManager.clearLayers();
            }

            var currentTimeRangeType = selectedTimeRangeType;
            var targetCoreManager = this.coreManagerByKey.get(`${currentTimeRangeType}`);
            targetCoreManager.redrawLayers();
        }

    };

}(this));
