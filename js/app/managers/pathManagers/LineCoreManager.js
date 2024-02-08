(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.LineCoreManager = class LineCoreManager {
        constructor(mapBoth, globalState, layerName, periodManager, stationManager, otherPeriodManager) {
            this.mapLeft = mapBoth.mapLeft;
            this.globalState = globalState;
            this.layerName = layerName;

            this.periodManager = periodManager;
            this.stationManager = stationManager;
            this.otherPeriodManager = otherPeriodManager;


            this.layerGroupLeft = L.layerGroup();

            this.currentPathLayerGroup;
        }

        async init() {
            this.addEventListenersToMap();
            return new Promise(function(resolve, reject) {
                resolve();
            });
        }

        draw() {
            var pathLayerGroup = this._createPathLayerGroup();
            pathLayerGroup.addTo(this.layerGroupLeft);
            this.currentPathLayerGroup = pathLayerGroup;
        }

        redraw() {
            this.currentPathLayerGroup.removeFrom(this.layerGroupLeft);
            this.draw();
        }

        addEventListenersToMap() {
            if (this.layerName === '') {
                this.layerGroupLeft.addTo(this.mapLeft);
                return;
            }

            var self = this;
            this.mapLeft.on('overlayadd', function(layersControlEvent) {
                var targetLayer = MyApp.UtilMap.findLayerByNameInActiveLayers(self.mapLeft, self.layerName);
                if (targetLayer) {
                    if (self.mapLeft.hasLayer(self.layerGroupLeft) === false) {
                        self.layerGroupLeft.addTo(self.mapLeft);
                    }
                }else{
                }
            });
            this.mapLeft.on('overlayremove', function(layersControlEvent) {
                var targetLayer = MyApp.UtilMap.findLayerByNameInActiveLayers(self.mapLeft, self.layerName);
                if (targetLayer) {
                }else{
                    if (self.mapLeft.hasLayer(self.layerGroupLeft)) {
                        self.layerGroupLeft.removeFrom(self.mapLeft);
                    }
                }
            });
        }

        _createPathLayerGroup() {
            var layerGroup = L.layerGroup();

            var lineInfoList = this._retrieveLineInfoList();
            var lineLayerGroup = this._createLineLayerGroup(lineInfoList);
            layerGroup.addLayer(lineLayerGroup);

            var pointInfoList = this._retrievePointInfoList();
            var pointLayerGroup = this._createPointLayerGroup(pointInfoList);
            layerGroup.addLayer(pointLayerGroup);

            return layerGroup;
        }

        _retrieveLineInfoList() {
            var periodPathInfoList = this.periodManager.getPathInfoList();
            var stationPathInfoList = this.stationManager.getPathInfoList();
            var otherPeriodPathInfoList = this.otherPeriodManager.getPathInfoListForCorrection();
            var pathInfoList = periodPathInfoList.concat(stationPathInfoList);
            pathInfoList = pathInfoList.concat(otherPeriodPathInfoList);
            pathInfoList.sort((a, b) => {
                if (a.year < b.year) return -1;
                if (a.year > b.year) return 1;
                return 0;
            });
            return pathInfoList;
        }

        _createLineLayerGroup(lineInfoList) {
            var layerGroup = L.layerGroup();

            var appliedPathOption = null;
            var latlngList = [];

            var len = lineInfoList.length;
            for (var i = 0; i < len; i++) {
                var lineInfo= lineInfoList[i];
                this._pushLatLng(latlngList, lineInfo);

                var currentPathOption = this._retrievePathOption(lineInfo);
                if (i === 0) {
                    if (this._hasPathOption(currentPathOption)) {
                        appliedPathOption = currentPathOption;
                    }else{
                    }
                    continue;
                }
                if (i === 1) {
                    if (appliedPathOption === null) {
                        appliedPathOption = currentPathOption;
                    }
                }

                if (this._hasChangedPathOption(appliedPathOption, currentPathOption) === false) {
                    if (i < len - 1) {
                        continue;
                    }
                }

                var polyline = this._createPolyline(latlngList, appliedPathOption);
                layerGroup.addLayer(polyline);

                latlngList = [];
                this._pushLatLng(latlngList, lineInfo);
                appliedPathOption = currentPathOption;
            }

            return layerGroup;
        }

        _pushLatLng(latlngList, lineInfo) {
            latlngList.push([lineInfo.lat, lineInfo.lng]);
        }

        _retrievePathOption(lineInfo) {
            var option = {
                weight: lineInfo.pathWeight,
                color: lineInfo.pathColor,
                dashArray: lineInfo.pathDashArray,
                opacity: lineInfo.pathOpacity,
            };
            return option;
        }

        _hasPathOption(current) {
            if (current.weight === 0 && current.color === '' && current.dashArray === null && current.opacity === 0.0) {
                return false;
            }
            return true;
        }

        _hasChangedPathOption(applied, current) {
            if (current.weight === 0 && current.color === '' && current.dashArray === null && current.opacity === 0.0) {
                return false;
            }
            if (applied.weight === current.weight && applied.color === current.color && applied.dashArray === current.dashArray && applied.opacity === current.opacity) {
                return false;
            }
            return true;
        }

        _createPolyline(latlngList, appliedPathOption) {
            var polyline = L.polyline(latlngList, appliedPathOption);
            return polyline;
        }

        _retrievePointInfoList() {
            var periodPointInfoList = this.periodManager.getPointInfoList();
            return periodPointInfoList;
        }

        _createPointLayerGroup(pointInfoList) {
            var layerGroup = L.layerGroup();

            var options = {
                radius: 1,
                color: '#000',
                fill: true,
                fillColor: '#000',
                fillOpacity: 1.0,
            };

            var len = pointInfoList.length;
            for (var i = 0; i < len; i++) {
                var pointInfo= pointInfoList[i];
                var center = L.latLng(pointInfo.lat, pointInfo.lng);
                var circle = L.circleMarker(center, options);
                layerGroup.addLayer(circle);
            }

            return layerGroup;
        }

    };

}(this));
