(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.SwitchTimeRangeManager = class SwitchTimeRangeManager {
        constructor(gaChannel, mapBoth, globalState, myChannel) {
            this.gaChannel = gaChannel;
            this.mapLeft = mapBoth.mapLeft;
            this.globalState = globalState;
            this.myChannel = myChannel;
        }

        init() {
            this._settingOpenCloseMark();
            this._settingInitialSelected();
            this._settingChangeRadioEvent();
        }

        _settingOpenCloseMark() {
            var rootEl = document.querySelector('.js-switch-timerange-root-area');
            var headerEl = rootEl.querySelector('.js-switch-timerange-header');
            var openMarkEl = rootEl.querySelector('.js-switch-timerange-open-mark');
            var closeMarkEl = rootEl.querySelector('.js-switch-timerange-close-mark');
            headerEl.addEventListener('click', function() {
                rootEl.classList.toggle('collapse');
                openMarkEl.classList.toggle('display-none');
                closeMarkEl.classList.toggle('display-none');
            }, false);
        }

        _settingInitialSelected() {
            var radioEllist = document.querySelectorAll('input[name="js-switch-timerange-radio-group"]');
            var len = radioEllist.length;
            var strValue = String(this.globalState.timeRangeType);
            for (var i = 0; i < len; i++) {
                if (radioEllist[i].value === strValue) {
                    radioEllist[i].checked = true;
                    this._changeLabelColor(radioEllist[i], strValue);
                    this._changeLayerControlCheckboxEnable(this.mapLeft, strValue);
                    break;
                }
            }
        }

        _settingChangeRadioEvent() {
            var self = this;
            var radioEllist = document.querySelectorAll('input[name="js-switch-timerange-radio-group"]');
            var len = radioEllist.length;
            for (var i = 0; i < len; i++) {
                radioEllist[i].addEventListener('change', function(e) {
                    var radioEl = e.target;
                    var strValue = e.target.value;
                    self._changeLabelColor(radioEl, strValue);
                    self._changeLayerControlCheckboxEnable(self.mapLeft, strValue);
                    self._changeGlobalState(strValue);
                    var intValue = self._convToInt(strValue);
                    self._publish(intValue);
                    self.gaChannel.publish(`change_time_range_${strValue}`);
                }, false);
            }
        }

        _changeLabelColor(radioEl, strValue) {
            var labelEllist = document.querySelectorAll('.js-switch-timerange-radio-lbl');
            var len = labelEllist.length;
            for (var i = 0; i < len; i++) {
                labelEllist[i].classList.remove('switch-timerange-radio-lbl-yushi');
                labelEllist[i].classList.remove('switch-timerange-radio-lbl-jomon');
                labelEllist[i].classList.remove('switch-timerange-radio-lbl-sekki');
                labelEllist[i].classList.remove('switch-timerange-radio-lbl-earth');
            }
            var labelEl = radioEl.parentElement;
            if (strValue === String(MyApp.globalState.const.TIME_RANGE_TYPE_YUSHI)) {
                labelEl.classList.add('switch-timerange-radio-lbl-yushi');
            }else if (strValue === String(MyApp.globalState.const.TIME_RANGE_TYPE_JOMON)) {
                labelEl.classList.add('switch-timerange-radio-lbl-jomon');
            }else if (strValue === String(MyApp.globalState.const.TIME_RANGE_TYPE_SEKKI)) {
                labelEl.classList.add('switch-timerange-radio-lbl-sekki');
            }else if (strValue === String(MyApp.globalState.const.TIME_RANGE_TYPE_EARTH)) {
                labelEl.classList.add('switch-timerange-radio-lbl-earth');
            }else{
            }
        }

        _changeLayerControlCheckboxEnable(map, strValue) {
            var containerEl = map.getContainer();
            var labelElList = containerEl.querySelectorAll('.leaflet-control-container .leaflet-control-layers .leaflet-control-layers-list .overlay-menu-disable-earth');
            labelElList.forEach(function(labelEl) {
                var checkboxEl = labelEl.querySelector('input[type="checkbox"]');
                if (strValue === String(MyApp.globalState.const.TIME_RANGE_TYPE_EARTH)) {
                    checkboxEl.disabled = true;
                }else{
                    checkboxEl.disabled = false;
                }
            });
        }

        _convToInt(strValue) {
            var intValue = parseInt(strValue, 10) || 1;
            return intValue;
        }

        _changeGlobalState(strValue) {
            var intValue = this._convToInt(strValue);
            this.globalState.timeRangeType = intValue;
        }

        setTimeRange(timeRangeTypeStrValue) {
            this._changeGlobalState(timeRangeTypeStrValue);
            this._settingInitialSelected();
        }

        _publish(selectedTimeRangeType) {
            var topicName = MyApp.globalConst.TopicName.switchedTimeRange;
            var options = {
                selectedTimeRangeType: selectedTimeRangeType,
            };
            this.myChannel.publish(topicName, options);
        }

    };

}(this));
