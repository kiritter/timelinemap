(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MarkerSecondPeriodManager = class MarkerSecondPeriodManager {
        constructor(gaChannel, mapBoth, globalState) {
            this.gaChannel = gaChannel;
            this.mapBoth = mapBoth;
            this.globalState = globalState;

            this.list = [
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_YUSHI, url: 'geojson/01_timelines/13a_second_period.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_JOMON, url: 'geojson/01_timelines/23a_second_period.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_SEKKI, url: 'geojson/01_timelines/33a_second_period.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_EARTH, url: 'geojson/01_timelines/93a_second_period.geojson'},
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
            var layerName = 'second_period';
            var callbacks = {
                'tooltipContentCallback': MarkerSecondPeriodManager._buildTooltipContent,
                'tooltipCalcAbsoluteDivPosCallback': MyApp.UtilLeafletTooltipAbsoluteDivPos.calcAbsoluteDivPos,
                'popupContentCallback': null,
            };
            var options = {
                shouldCircleMarker: true,
                circleMarkerColNames: {radius: 'circleMarkerRadius', color: 'circleMarkerColor', isFill: 'circleMarkerIsFill', opacity: 'circleMarkerOpacity'},
                shouldTooltip: true,
                tooltipNames: {className: 'tooltip-second-period', geZoom: 'geZoom', direction: 'direction'},
                shouldPopup: false,
                isNoIconMarker: false,
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
                content = MarkerSecondPeriodManager._buildTooltipContentWithAbsDesc(properties);
            return content;
        }
        static _buildTooltipContentWithoutUrl(properties) {
            var content = `
<div>
    <div>${properties.dispYear}</div>
    <div>${properties.periodName}</div>
    <div class="desc-content">${properties.desc}</div>
</div>
`;
            return content;
        }

        static _buildTooltipContentWithAbsDesc(properties) {
            var content = `
<div>
    <div>${properties.dispYear}</div>
    <div>${properties.periodName}</div>
    <div class="desc-content">${properties.desc}</div>
</div>
<div class="tooltip-absolute-div">
    <div class="desc-content">${properties.absDesc}</div>
</div>
`;
            return content;
        }

        static _buildPopupContent(properties) {
            var content = `
`;
            return content;
        }

        getPathInfoList() {
            var currentTimeRangeType = this.globalState.timeRangeType;
            var targetCoreManager = this.coreManagerByKey.get(`${currentTimeRangeType}`);
            return targetCoreManager.getPathInfoList();
        }
        getPathInfoListForCorrection() {
            var currentTimeRangeType = this.globalState.timeRangeType;
            var targetCoreManager = this.coreManagerByKey.get(`${currentTimeRangeType}`);
            return targetCoreManager.getPathInfoListForCorrection();
        }
        getPointInfoList() {
            var currentTimeRangeType = this.globalState.timeRangeType;
            var targetCoreManager = this.coreManagerByKey.get(`${currentTimeRangeType}`);
            var pathInfoList = targetCoreManager.getPathInfoList();
            return pathInfoList.filter(obj => obj.pathColor !== '');
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
