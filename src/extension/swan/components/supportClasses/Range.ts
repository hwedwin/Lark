//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module swan {

    /**
     * 范围选取组件,该组件包含一个值和这个值所允许的最大最小约束范围。
     */
    export class Range extends Component {
        /**
         * 创建一个 Range 实例
         */
        public constructor() {
            super();
        }

        $maximum:number = 100;
        /**
         * 最大有效值改变标志
         */
        private maxChanged:boolean = false;

        /**
         * 最大有效值
         */
        public get maximum():number {
            return this.$maximum;
        }

        public set maximum(value:number) {
            value = +value || 0;
            if (value === this.$maximum)
                return;
            this.$maximum = value;
            this.maxChanged = true;
            this.invalidateProperties();
            this.invalidateDisplayList();
        }


        $minimum:number = 0;

        /**
         * 最小有效值改变标志
         */
        private minChanged:boolean = false;

        /**
         * 最小有效值
         */
        public get minimum():number {
            return this.$minimum;
        }

        public set minimum(value:number) {
            value = +value || 0;
            if (value === this.$minimum)
                return;
            this.$minimum = value;
            this.minChanged = true;
            this.invalidateProperties();
            this.invalidateDisplayList();
        }

        private _stepSize:number = 1;

        /**
         * 单步大小改变的标志
         */
        private stepSizeChanged:boolean = false;

        /**
         * 调用 changeValueByStep() 方法时 value 属性更改的单步大小。默认值为 1。
         * 除非 snapInterval 为 0，否则它必须是 snapInterval 的倍数。
         * 如果 stepSize 不是倍数，则会将它近似到大于或等于 snapInterval 的最近的倍数。
         */
        public get stepSize():number {
            return this._stepSize;
        }

        public set stepSize(value:number) {
            value = +value || 0;
            if (value === this._stepSize)
                return;

            this._stepSize = value;
            this.stepSizeChanged = true;

            this.invalidateProperties();
        }

        private _value:number = 0;

        private _changedValue:number = 0;
        /**
         * 此范围的当前值改变标志
         */
        private valueChanged:boolean = false;

        /**
         * 此范围的当前值。
         */
        public get value():number {
            return this.valueChanged ? this._changedValue : this._value;
        }

        public set value(newValue:number) {
            newValue = +newValue || 0;
            this.$setValue(newValue);
        }

        $setValue(newValue:number) {
            if (newValue === this.value)
                return;
            this._changedValue = newValue;
            this.valueChanged = true;
            this.invalidateProperties();
        }

        $snapInterval:number = 1;

        private snapIntervalChanged:boolean = false;

        private _explicitSnapInterval:boolean = false;

        /**
         * snapInterval 属性定义 value 属性的有效值。如果为非零，则有效值为 minimum 与此属性的整数倍数之和，且小于或等于 maximum。
         * 例如，如果 minimum 为 10，maximum 为 20，而此属性为 3，则可能的有效值为 10、13、16、19 和 20.
         * 如果此属性的值为零，则仅会将有效值约束到介于 minimum 和 maximum 之间（包括两者）。
         * 此属性还约束 stepSize 属性（如果设置）的有效值。如果未显式设置此属性，但设置了 stepSize，则 snapInterval 将默认为 stepSize。
         */
        public get snapInterval():number {
            return this.$snapInterval;
        }

        public set snapInterval(value:number) {
            this._explicitSnapInterval = true;
            value = +value || 0;
            if (value === this.$snapInterval)
                return;
            if (lark.isNone(value)) {
                this.$snapInterval = 1;
                this._explicitSnapInterval = false;
            }
            else {
                this.$snapInterval = value;
            }

            this.snapIntervalChanged = true;
            this.stepSizeChanged = true;

            this.invalidateProperties();
        }

        /**
         * 处理对组件设置的属性
         */
        protected commitProperties():void {
            super.commitProperties();

            if (this.$minimum > this.$maximum) {

                if (!this.maxChanged)
                    this.$minimum = this.$maximum;
                else
                    this.$maximum = this.$minimum;
            }

            if (this.valueChanged || this.maxChanged || this.minChanged || this.snapIntervalChanged) {
                var currentValue:number = (this.valueChanged) ? this._changedValue : this._value;
                this.valueChanged = false;
                this.maxChanged = false;
                this.minChanged = false;
                this.snapIntervalChanged = false;
                this.setValue(this.nearestValidValue(currentValue, this.$snapInterval));
            }

            if (this.stepSizeChanged) {
                if (this._explicitSnapInterval) {
                    this._stepSize = this.nearestValidSize(this._stepSize);
                }
                else {
                    this.$snapInterval = this._stepSize;
                    this.setValue(this.nearestValidValue(this._value, this.$snapInterval));
                }

                this.stepSizeChanged = false;
            }
        }

        /**
         * 修正stepSize到最接近snapInterval的整数倍
         */
        private nearestValidSize(size:number):number {
            var interval:number = this.snapInterval;
            if (interval == 0)
                return size;

            var validSize:number = Math.round(size / interval) * interval;
            return (Math.abs(validSize) < interval) ? interval : validSize;
        }

        /**
         * 修正输入的值为有效值
         * @param value 输入值。
         * @param interval snapInterval 的值，或 snapInterval 的整数倍数。
         */
        protected nearestValidValue(value:number, interval:number):number {
            if (interval == 0)
                return Math.max(this.minimum, Math.min(this.maximum, value));

            var maxValue:number = this.maximum - this.minimum;
            var scale:number = 1;

            value -= this.minimum;
            if (interval != Math.round(interval)) {
                var parts:Array<any> = ((1 + interval).toString()).split(".");
                scale = Math.pow(10, parts[1].length);
                maxValue *= scale;
                value = Math.round(value * scale);
                interval = Math.round(interval * scale);
            }

            var lower:number = Math.max(0, Math.floor(value / interval) * interval);
            var upper:number = Math.min(maxValue, Math.floor((value + interval) / interval) * interval);
            var validValue:number = ((value - lower) >= ((upper - lower) / 2)) ? upper : lower;

            return (validValue / scale) + this.minimum;
        }

        /**
         * 设置当前值。此方法假定调用者已经使用了 nearestValidValue() 方法来约束 value 参数
         * @param value value属性的新值
         */
        protected setValue(value:number):void {
            if (this._value === value)
                return;
            if (this.$maximum > this.$minimum)
                this._value = Math.min(this.$maximum, Math.max(this.$minimum, value));
            else
                this._value = value;
            this.valueChanged = false;
            this.invalidateDisplayList();
            UIEvent.emitUIEvent(this, UIEvent.VALUE_COMMIT);
        }

        /**
         * 按 stepSize增大或减小当前值
         * @param increase 若为 true，则向value增加stepSize，否则减去它。
         */
        public changeValueByStep(increase:boolean = true):void {
            var stepSize = this._stepSize;
            if (stepSize === 0)
                return;

            var newValue:number = (increase) ? this.value + stepSize : this.value - stepSize;
            this.setValue(this.nearestValidValue(newValue, this.snapInterval));
        }

        /**
         * 绘制对象和/或设置其子项的大小和位置
         */
        protected updateDisplayList(w:number, h:number):void {
            super.updateDisplayList(w, h);
            this.updateSkinDisplayList();
        }

        /**
         * 更新皮肤部件（通常为滑块）的大小和可见性。
         * 子类覆盖此方法以基于 minimum、maximum 和 value 属性更新滑块的大小、位置和可见性。
         */
        protected updateSkinDisplayList():void {
        }
    }

}