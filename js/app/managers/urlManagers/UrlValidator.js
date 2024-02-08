(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UrlValidator = class UrlValidator {
        constructor() {
        }

        isValid(urlQueryParamRepo) {
            var zoom = urlQueryParamRepo.getQueryValueBy('z');
            if (this._isValidZoom(zoom) === false) {
                return false;
            }
            var lat = urlQueryParamRepo.getQueryValueBy('lat');
            var lng = urlQueryParamRepo.getQueryValueBy('lng');
            if (this._isValidLatLngRequired(lat, lng) === false) {
                return false;
            }
            var timeRange = urlQueryParamRepo.getQueryValueBy('tr');
            if (this._isValidTimeRange(timeRange) === false) {
                return false;
            }
            var left = urlQueryParamRepo.getQueryValueBy('left');
            var right = urlQueryParamRepo.getQueryValueBy('right');
            if (this._isValidLeftRight(left, right) === false) {
                return false;
            }
            return true;
        }

        _isValidZoom(zoom) {
            if (zoom) {
                if (MyApp.UtilNumber.isValidZoomNumber(zoom)) {
                    return true;
                }
            }
            return false;
        }

        _isValidLatLngRequired(lat, lng) {
            if (lat && lng) {
                if (this._isValidLatLngCore(lat, lng)) {
                    return true;
                }
            }
            return false;
        }
        _isValidLatLngOptional(lat, lng) {
            if (lat === undefined && lng === undefined) {
                return true;
            }
            if (lat && lng) {
                if (this._isValidLatLngCore(lat, lng)) {
                    return true;
                }
            }
            return false;
        }
        _isValidLatLngCore(lat, lng) {
            if (MyApp.UtilNumber.isDecimalNumber(lat) && MyApp.UtilNumber.isDecimalNumber(lng)) {
                var latF = parseFloat(lat, 10);
                if (-90 <= latF && latF <= 90) {
                    var lngF = parseFloat(lng, 10);
                    if (-180 <= lngF && lngF <= 180) {
                        return true;
                    }
                }
            }
            return false;
        }

        _isValidTimeRange(timeRange) {
            if (timeRange) {
                if (MyApp.UtilNumber.isNaturalNumber(timeRange)) {
                    var timeRangeInt = parseInt(timeRange, 10);
                    if (timeRangeInt === MyApp.globalState.const.TIME_RANGE_TYPE_YUSHI) {
                        return true;
                    }
                    if (timeRangeInt === MyApp.globalState.const.TIME_RANGE_TYPE_JOMON) {
                        return true;
                    }
                    if (timeRangeInt === MyApp.globalState.const.TIME_RANGE_TYPE_SEKKI) {
                        return true;
                    }
                    if (timeRangeInt === MyApp.globalState.const.TIME_RANGE_TYPE_EARTH) {
                        return true;
                    }
                }
            }
            return false;
        }

        _isValidLeftRight(left, right) {
            return true;
        }

    };

}(this));
