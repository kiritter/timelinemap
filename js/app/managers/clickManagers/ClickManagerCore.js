(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.ClickManagerCore = class ClickManagerCore {
        constructor(map, cssClassNameSuffix) {
            this.map = map;
            this.cssClassNameSuffix = cssClassNameSuffix;

            this.layerGroup = L.layerGroup();
            this.historyList = [];
        }

        init() {
            this.settingMap();
            this.settingClickEvent();
        }

        settingMap() {
            this.layerGroup.addTo(this.map);
        }

        settingClickEvent() {
            var self = this;
            this.map.on('click', function(mouseEvent) {
                var selectedLatLng = mouseEvent.latlng;
                self.showLatLngInfoAndCircles(selectedLatLng);
            });
        }

        showLatLngInfoAndCircles(selectedLatLng) {
            this.showLatLngInfo(selectedLatLng);
            this.showGroup(selectedLatLng);
        }

        showLatLngInfo(selectedLatLng) {
            var latlngText = `Lat(緯度),Lng(経度) [${selectedLatLng.lat}, ${selectedLatLng.lng}] GeoJSON用[${selectedLatLng.lng}, ${selectedLatLng.lat}]`;
            var areaRootEl = document.querySelector(`.js-latlng-info-area-${this.cssClassNameSuffix}`);
            var label1El = areaRootEl.querySelector('.js-show-latlng-label');
            label1El.innerText = `[${selectedLatLng.lat}, ${selectedLatLng.lng}]`;
            var label2El = areaRootEl.querySelector('.js-show-lnglat-label');
            label2El.innerText = `[${selectedLatLng.lng}, ${selectedLatLng.lat}]`;
        }

        showGroup(selectedLatLng) {
            this._hiddenLastGroup();

            var center = L.latLng(selectedLatLng.lat, selectedLatLng.lng);
            var marker = this._createLatLngMarker(center);

            this._showCurrentGroup(marker);
        }

        _hiddenLastGroup() {
            var lastGroup = this.historyList[this.historyList.length - 1];
            if (lastGroup) {
                this.layerGroup.removeLayer(lastGroup);
            }

            this._cleanupHistory();
        }

        _cleanupHistory() {
            const ACTIVE_NUM = 10;
            const LIMIT_NUM = 20;
            var len = this.historyList.length;
            if (len > LIMIT_NUM) {
                var removeNum = len - ACTIVE_NUM;
                this.historyList.splice(0, removeNum);
            }
        }

        _createLatLngMarker(selectedLatLng) {
            var latlng = L.latLng(selectedLatLng.lat, selectedLatLng.lng);
            var options = {
                radius: 1,
                color: '#F00',
                fill: true,
                fillColor: '#F00',
                fillOpacity: 1.0,
            };
            var marker = L.circleMarker(latlng, options);
            return marker;
        }

        _showCurrentGroup(marker) {
            var group = L.layerGroup([marker]);
            this.layerGroup.addLayer(group);
            this.historyList.push(group);
        }

    };

}(this));
