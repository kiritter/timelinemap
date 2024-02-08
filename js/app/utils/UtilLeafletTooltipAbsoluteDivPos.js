(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UtilLeafletTooltipAbsoluteDivPos = class UtilLeafletTooltipAbsoluteDivPos {
        constructor() {
        }

        static calcAbsoluteDivPos(tooltipLayer, direction) {
            var tooltipContainerEl = tooltipLayer.getElement();
            var tooltipWidth = tooltipContainerEl.offsetWidth;
            var tooltipHeight = tooltipContainerEl.offsetHeight;
            var divEl = tooltipContainerEl.querySelector('.tooltip-absolute-div');

            var tooltipPadding = 6;
            var bufferLeftRight = 5;
            var bufferTopBottom = 5;

            if (direction === 'right') {
                divEl.style.top = tooltipPadding + 'px';
                divEl.style.left = (tooltipWidth + bufferLeftRight) + 'px';

            }else if (direction === 'left') {
                divEl.style.top = tooltipPadding + 'px';
                divEl.style.right = (tooltipWidth + bufferLeftRight) + 'px';

            }else if (direction === 'bottom') {
                divEl.style.top = (tooltipHeight + bufferTopBottom) + 'px';
                divEl.style.left = tooltipPadding + 'px';

            }else if (direction === 'top') {
                divEl.style.bottom = (tooltipHeight + bufferTopBottom) + 'px';
                divEl.style.left = tooltipPadding + 'px';
            }
        }

    };

}(this));
