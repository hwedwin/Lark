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
     * @language en_US
     * The ItemRenderer class is the base class for item renderers.
     *
     * @state up Up state
     * @state down Down state
     * @state upAndSelected Up state when the button is selected
     * @state downAndSelected Down state when the button is selected
     * @version Lark 1.0
     * @version Swan 1.0
     * @platform Web,Native
     * @includeExample examples/Samples/src/extension/swan/components/ItemRendererExample.ts
     */
    /**
     * @language zh_CN
     * ItemRenderer 类是项呈示器的基类。
     *
     * @state up 弹起状态
     * @state down 按下状态
     * @state upAndSelected 选择时的弹起状态
     * @state downAndSelected 选择时的按下状态
     * @version Lark 1.0
     * @version Swan 1.0
     * @platform Web,Native
     * @includeExample examples/Samples/src/extension/swan/components/ItemRendererExample.ts
     */
    export class ItemRenderer extends Component implements IItemRenderer {

        /**
         * @language en_US
         * Constructor.
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数。
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.on(lark.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        }

        /**
         * @private
         */
        private _data:any = null;
        /**
         * @language en_US
         * The data to render or edit.
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要呈示或编辑的数据。
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public get data():any {
            return this._data;
        }

        public set data(value:any) {
            this._data = value;
            PropertyEvent.emitPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "data");
            this.dataChanged();
        }

        /**
         * @language en_US
         * Update the view when the <code>data</code> property changes.
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当数据改变时，更新视图。
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected dataChanged():void {

        }

        /**
         * @private
         */
        private _selected:boolean = false;
        /**
         * @language en_US
         * Contains <code>true</code> if the item renderer
         * can show itself as selected.
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果项呈示器可以将其自身显示为已选中，则为 true。
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public get selected():boolean {
            return this._selected;
        }

        public set selected(value:boolean) {
            if (this._selected == value)
                return;
            this._selected = value;
            this.invalidateState();
        }

        /**
         * @language en_US
         * The index of the item in the data provider
         * of the host component of the item renderer.
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 项呈示器的数据提供程序中的项目索引。
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public itemIndex:number = -1;

        /**
         * @private
         * 指示第一次分派 TouchEvent.TOUCH_BEGIN 时，触摸点是否在按钮上。
         */
        private touchCaptured:boolean = false;

        /**
         * @language en_US
         * Handles <code>TouchEvent.TOUCH_BEGIN</code> events
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 触碰开始时触发事件
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected onTouchBegin(event:lark.TouchEvent):void {
            this.$stage.on(lark.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.touchCaptured = true;
            this.invalidateState();
            event.updateAfterEvent();
        }

        /**
         * @private
         * 舞台上触摸弹起事件
         */
        private onStageTouchEnd(event:lark.Event):void {
            var stage = event.$currentTarget;
            stage.removeListener(lark.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.touchCaptured = false;
            this.invalidateState();
        }

        /**
         * @inheritDoc
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected getCurrentState():string {
            var state = "up";
            if (this._selected || this.touchCaptured) {
                state = "down";
            }
            var selectedState = state + "AndSelected";
            var skin = this.skin;
            if (skin&&skin.hasState(selectedState)) {
                return selectedState;
            }
            return state;
        }
    }

    registerBindable(ItemRenderer.prototype, "data");
}