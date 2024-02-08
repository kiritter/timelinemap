(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MapManager = class MapManager {
        constructor(configMap, currentCacheType) {
            this.configMap = configMap;
            this.isCacheTypeFull = MyApp.PermanentCacheStatusRepo.isCacheTypeFull(currentCacheType);
        }

        init() {
            var mapLeft = this.createMapLeft('map-left');
            this._changeLeafletLinkWithTargetBlank(mapLeft);
            return {mapLeft: mapLeft};
        }

        _changeLeafletLinkWithTargetBlank(map) {
            var containerEl = map.getContainer();
            var anchorElList = containerEl.querySelectorAll('.leaflet-control-container .leaflet-control-attribution a');
            var leafletAnchor = anchorElList[0];
            leafletAnchor.setAttribute('target', '_blank');
        }

        createMapLeft(mapId) {
            var baseMaps = {};
            var overlayMaps = {};
            var defaultSelectedLayers = [];

            this.addLayersTo(this.configMap.LayerConfigTable, this.configMap.MapLeftBaseList, baseMaps, defaultSelectedLayers)
            this.addLayersTo(this.configMap.LayerConfigTable, this.configMap.MapLeftOverlayList, overlayMaps, defaultSelectedLayers)

            var options = {
                collapsed: false,
                position: 'topleft',
                _myControlLayerMenuHeightBuffer: this.configMap._myControlLayerMenuHeightBuffer,
            };

            var isZoomCtrl = false;
            var isAttributionControl = false;
            var map = this.createMap(mapId, defaultSelectedLayers, baseMaps, overlayMaps, options, isZoomCtrl, isAttributionControl);

            L.control.zoom({
                position: 'topright'
            }).addTo(map);

            L.control.attribution({
                position: 'bottomleft'
            }).addTo(map);

            if (isAttributionControl === false) {
                defaultSelectedLayers.forEach(function(layer) {
                    layer.addTo(map);
                });
            }

            return map;
        }

        addLayersTo(table, list, maps, defaultSelectedLayers) {
            var len = list.length;
            for (var i = 0; i < len; i++) {
                var obj = list[i];
                var layerConfig = table[obj.name];
                var layer = this.createLayer(layerConfig);
                maps[layerConfig.caption] = layer;
                if (obj.selected) {
                    defaultSelectedLayers.push(layer);
                }
            }
        }

        createLayer(layerConfig) {
            var funcionByType = {};
            funcionByType[MyApp.configMap.TileType.Empty] = this.createLayerForEmpty.bind(this);
            funcionByType[MyApp.configMap.TileType.Standard] = this.createLayerForStandard.bind(this);

            var actualTileType = (layerConfig.tileType) ? layerConfig.tileType : MyApp.configMap.TileType.Standard;
            var layer = funcionByType[actualTileType](layerConfig);
            return layer;
        }
        createLayerForEmpty(layerConfig) {
            var layer = L.gridLayer(layerConfig.options);
            return layer;
        }
        createLayerForStandard(layerConfig) {
            var layer;
            if (this.isCacheTypeFull) {
                layer = L.gridLayer.tileCanvas.cache(layerConfig.options);
            }else{
                var url = layerConfig.options.myTileUrl;
                layer = L.tileLayer(url, layerConfig.options);
            }
            return layer;
        }

        createMap(mapId, defaultSelectedLayers, baseMaps, overlayMaps, options, isZoomCtrl, isAttributionControl) {
            var zoomMinMax = MyApp.UtilMap.getZoomLevelMinMax();
            var initialZoomLevel = MyApp.UtilMap.getInitialZoomLevel();
            var initialCenter = MyApp.UtilMap.getInitialCenter();
            var limitMapBounds = MyApp.UtilMap.getLimitMapBounds();

            var map = L.map(mapId, {
                maxBounds: limitMapBounds,
                maxBoundsViscosity: 1.0,
                center: initialCenter,
                zoom: initialZoomLevel,
                minZoom: initialZoomLevel,
                maxZoom: zoomMinMax.maxZoom,
                layers: (isAttributionControl === false) ? [] : defaultSelectedLayers,
                zoomControl: isZoomCtrl,
                attributionControl: isAttributionControl
            });

            var layerControl = L.control.layers.withClose(baseMaps, overlayMaps, options).addTo(map);

            this.showCurrentZoomLevel(initialZoomLevel);

            var self = this;
            map.on('zoomend', function(event) {
                var currentValue = event.target.getZoom();
                self.showCurrentZoomLevel(currentValue);
            });


            return map;
        }

        showCurrentZoomLevel(currentValue) {
            var zoomLevelEl = document.querySelector('.js-current-zoom-level');
            zoomLevelEl.innerText = currentValue;
        }

        forceEnableControlLayerRadioCheck() {
            var radioCheckElList = document.querySelectorAll('.leaflet-control-layers .leaflet-control-layers-list .leaflet-control-layers-overlays .leaflet-control-layers-selector');
            radioCheckElList.forEach(function(el) {
                el.disabled = false;
            });
        }

    };

}(this));
