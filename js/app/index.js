async function initMyApp(global) {

    var gaChannel = new MyApp.Ga4Channel();
    var gaRepo = new MyApp.Ga4Repo(gaChannel, global);
    gaRepo.doSubscription();

    var isAsyncPublish = true;
    var myChannel = new MyApp.MyChannel(isAsyncPublish);

    MyApp.AdvancedDialogManager.settingPopupBodyHtml();
    var permanentCacheStatusRepo = new MyApp.PermanentCacheStatusRepo(MyApp.globalState);
    var permanentCacheManager = new MyApp.PermanentCacheManager(gaChannel, MyApp.globalState, permanentCacheStatusRepo, global.navigator, global.location);
    permanentCacheManager.init();
    var currentCacheType = await permanentCacheManager.findCurrentCacheType();

    var mapManager = new MyApp.MapManager(MyApp.configMap, currentCacheType);
    var mapBoth = mapManager.init();

    var switchTimeRangeManager = new MyApp.SwitchTimeRangeManager(gaChannel, mapBoth, MyApp.globalState, myChannel);
    switchTimeRangeManager.init();

    var timelineManager = new MyApp.TimelineManager(gaChannel, mapBoth, MyApp.globalState, myChannel);
    timelineManager.init();

    var prefBorderManager = new MyApp.PrefectureBorderManager(gaChannel, mapBoth, MyApp.globalState, myChannel);
    prefBorderManager.init();

    var urlRepo = new MyApp.UrlRepo(global.location);
    var urlQueryParamRepo = urlRepo.getUrlQueryParamRepo();

    var clickManager = new MyApp.ClickManager(mapBoth);
    clickManager.init();

    var urlCopyManager = new MyApp.UrlCopyManager(gaChannel, mapBoth, MyApp.globalState, urlRepo, global.navigator);
    urlCopyManager.init();

    var initialSetViewManager = new MyApp.InitialSetViewManager(gaChannel, mapBoth, urlQueryParamRepo, switchTimeRangeManager);
    initialSetViewManager.init();

    var advancedDialogManager = new MyApp.AdvancedDialogManager(gaChannel, permanentCacheManager);
    advancedDialogManager.init();
    var advancedDialogDragHandler = new MyApp.AdvancedDialogDragHandler(global);
    advancedDialogDragHandler.init();

    var searchLatLngManager = new MyApp.SearchLatLngManager(gaChannel, mapBoth, clickManager);
    searchLatLngManager.init();

    mapBoth.mapLeft.fire('overlayadd');
}

initMyApp(this);
