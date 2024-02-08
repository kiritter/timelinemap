(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};
    MyApp.configMap = {};

    MyApp.configMap._myControlLayerMenuHeightBuffer = 0;

    MyApp.configMap.TileType = {
        Empty: 1,
        Standard: 2,
    };

    MyApp.configMap.MapLeftBaseList = [
        {name: 'osm', selected: true},
    ];
    MyApp.configMap.MapLeftOverlayList = [
        {name: 'latest', selected: false},
        {name: 'pref_border', selected: false},
        {name: 'period', selected: true},
        {name: 'second_path', selected: true},
        {name: 'second_period', selected: true},
        {name: 'event', selected: false},
        {name: 'event_art', selected: false},
        {name: 'volcano', selected: false},
        {name: 'global_event', selected: false},
        {name: 'axis', selected: false},
        {name: 'station', selected: false},
    ];


    MyApp.configMap.LayerConfigTable = {
        'osm': {
            caption: 'OpenStreetMap',
            options: {
                myTileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
                crossOrigin: 'anonymous',
                minZoom: 5,
                maxZoom: 18,
                maxNativeZoom: 18,
                myLayerName: 'osm',
                myCacheName: 'osm',
                myCacheRepo: MyApp.globalCacheRepo,
            },
        },


        'latest': {
            caption: '最新 (Zoom:2-8,9-13,14-18)',
            options: {
                myTileUrl: 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
                attribution: `<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>`,
                crossOrigin: 'anonymous',
                minZoom: 5,
                maxZoom: 18,
                maxNativeZoom: 18,
                myLayerName: 'latest',
                myCacheName: 'latest',
                myCacheRepo: MyApp.globalCacheRepo,
                blockDescription: '航空写真を表示できます',
                blockDescriptionCssClassName: 'block-description',
            },
        },

        'period': {
            caption: '時代のラベル',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'period',
                addSeparatorToBeforebegin: true,
                blockDescription: '以下、選択した情報を表示します',
                blockDescriptionCssClassName: 'block-description',
            },
        },
        'second_path': {
            caption: '寒暖期間などの範囲の描画',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'second_path',
            },
        },
        'second_period': {
            caption: '補足説明',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'second_period',
            },
        },
        'event': {
            caption: '国内の出来事',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'event',
                addSeparatorToBeforebegin: true,
            },
        },
        'event_art': {
            caption: '国内の土偶/古墳/建築/書物/芸術',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'event_art',
                overlayMenuCssClassName: 'overlay-menu-disable-earth',
            },
        },
        'volcano': {
            caption: '国内/世界の🌋巨大噴火/大噴火',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'volcano',
            },
        },
        'global_event': {
            caption: '世界の出来事',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'global_event',
                overlayMenuCssClassName: 'overlay-menu-disable-earth',
            },
        },
        'axis': {
            caption: '1000年区切り/世紀区切り',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'axis',
                addSeparatorToBeforebegin: true,
            },
        },
        'station': {
            caption: '新幹線の駅 (※年情報は月を切り捨て)',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'station',
                isLastElement: true,
                lastElementLinkInfoList: [
                    {
                        sourceSummaryUrl: 'html/source_summary.html',
                        sourceSummaryText: '地図データの出典情報、参考文献情報',
                        sourceSummaryNote: '',
                        sourceSummaryCssClassName: 'source-summary-link',
                    },
                    {
                        sourceSummaryUrl: '../#product-map',
                        sourceSummaryText: '当Webサイトの🗾兄弟地図サイトを見る',
                        sourceSummaryNote: '',
                        sourceSummaryCssClassName: 'source-summary-link',
                    },
                ],
            },
        },
        'pref_border': {
            caption: '都道府県境 (細部簡略, 2014年時点)',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'pref_border',
                addSeparatorToBeforebegin: true,
                blockDescription: '↓ 初回選択時にデータ取得＆描画(転送量1.2MB)',
                blockDescriptionCssClassName: 'block-description-pref-border',
            },
        },

    };

}(this));
