/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module swan.sys {

    function sineInOut(t):number {
        return -0.5 * (Math.cos(Math.PI * t) - 1)
    }

    /**
     * 数值缓动工具类
     */
    export class Animation {
        /**
         */
        public constructor(updateFunction:(animation:Animation)=>void, thisObject:any) {
            this.updateFunction = updateFunction;
            this.thisObject = thisObject;
            this.timer = new lark.Timer(1000 / 60);
            this.timer.on(lark.TimerEvent.TIMER, this.doInterval, this);
        }

        private thisObject:any;

        /**
         * 是否正在播放动画，不包括延迟等待和暂停的阶段
         */
        public isPlaying:boolean = false

        /**
         * 动画持续时间,单位毫秒，默认值500
         */
        public duration:number = 500;

        /**
         * 动画到当前时间对应的值。
         */
        public currentValue:number = 0;

        /**
         * 起始值
         */
        public from:number = 0;
        /**
         * 终点值。
         */
        public to:number = 0;

        /**
         * 动画启动时刻
         */
        private startTime:number = 0;
        /**
         * 动画播放结束时的回调函数
         */
        public endFunction:(animation:Animation) => void = null;

        /**
         * 动画更新时的回调函数
         */
        public updateFunction:Function;

        /**
         * 开始正向播放动画,无论何时调用都重新从零时刻开始，若设置了延迟会首先进行等待。
         */
        public play():void {
            this.stop();
            this.start();
        }

        private timer:lark.Timer;

        /**
         * 开始播放动画
         */
        private start():void {
            this.isPlaying = false;
            this.currentValue = 0;
            this.caculateCurrentValue(0);
            this.startTime = lark.getTimer();
            this.doInterval();
            this.timer.start();
        }

        /**
         * 停止播放动画
         */
        public stop():void {
            this.isPlaying = false;
            this.startTime = 0;
            this.timer.stop();
        }

        /**
         * 计算当前值并返回动画是否结束
         */
        private doInterval(event?:lark.TimerEvent):void {
            var currentTime = lark.getTimer();
            var runningTime = currentTime - this.startTime;
            if (!this.isPlaying) {
                this.isPlaying = true;
            }
            var duration = this.duration;
            var fraction = duration == 0 ? 1 : Math.min(runningTime, duration) / duration;
            this.caculateCurrentValue(fraction);
            if (this.updateFunction)
                this.updateFunction.call(this.thisObject, this);
            var isEnded = runningTime >= duration;
            if (isEnded) {
                this.stop();
            }
            if (isEnded && this.endFunction) {
                this.endFunction.call(this.thisObject, this);
            }
            if(event){
                event.updateAfterEvent();
            }
        }

        /**
         * 计算当前值
         */
        private caculateCurrentValue(fraction:number):void {
            fraction = sineInOut(fraction);
            this.currentValue = this.from + (this.to - this.from) * fraction;
        }

    }
}