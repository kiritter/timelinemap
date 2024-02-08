(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UrlNormalizerForTimeline = class UrlNormalizerForTimeline {
        constructor() {
        }

        normalize(urlQueryParamRepo) {
            var clone = urlQueryParamRepo.getClone();
            if (this._isTimeRangeParamOnly(urlQueryParamRepo) === false) {
                MyApp.UtilDeepFreeze.execute(clone);
                return clone;
            }
            this._addInitialLeftParamsTo(clone);
            MyApp.UtilDeepFreeze.execute(clone);
            return clone;
        }

        _isTimeRangeParamOnly(urlQueryParamRepo) {
            var tr = urlQueryParamRepo.getQueryValueBy('tr');
            var left = urlQueryParamRepo.getQueryValueBy('left');
            if (tr && (left === undefined || left === '')) {
                return true;
            }
            if (tr && (Array.isArray(left) && left.length === 0)) {
                return true;
            }
            return false;
        }

        _addInitialLeftParamsTo(urlQueryParamRepo) {
            var selectedList = MyApp.configMap.MapLeftOverlayList.filter(obj => obj.selected === true);
            var layerNameList = selectedList.map(obj => obj.name);
            if (layerNameList.length === 0) {
            }else if (layerNameList.length === 1) {
                urlQueryParamRepo.addQueryKeyValue('left', layerNameList[0]);
            }else{
                urlQueryParamRepo.addQueryKeyValue('left', layerNameList);
            }
        }

    };

}(this));
