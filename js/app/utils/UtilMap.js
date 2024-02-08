(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UtilMap = class UtilMap {
        constructor() {
        }

        static getZoomLevelMinMax() {
            var minZoom = 5;
            var maxZoom = 18;
            return {minZoom: minZoom, maxZoom: maxZoom};
        }
        static getInitialZoomLevel() {
            var initZoom = 5;
            return initZoom;
        }

        static getInitialCenter() {
            var center = L.latLng(36.3622222, 135.2313889);
            return center;
        }

        static getLimitMapBounds() {




            var northWest = L.latLng(56.17002298293205, 105.20507812500001);
            var southEast = L.latLng(9.882275493429953, 165.23437500000003);
            var limitMapBounds = L.latLngBounds(northWest, southEast);
            return limitMapBounds;
        }

        static isWithinLimitMapBounds(targetLatLng) {
            var limitMapBounds = UtilMap.getLimitMapBounds();
            var contains = limitMapBounds.contains(targetLatLng);
            return contains;
        }

        static findLayerByNameInActiveLayers(map, layerName) {
            var list = UtilMap.findAllActiveLayers(map);
            var len = list.length;
            for (var i = 0; i < len; i++) {
                if (list[i].options.myLayerName === layerName) {
                    return list[i];
                }
            }
            return null;
        }

        static findAllActiveLayers(map) {
            var list = [];
            map.eachLayer((layer) => {
                if (layer instanceof L.GridLayer) {
                    list.push(layer);
                }
            });
            return list;
        }
        
    };

}(this));
