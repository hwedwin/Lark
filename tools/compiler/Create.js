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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../lib/types.d.ts" />
var Action = require('./Action');
var Build = require('./Build');
var Project = require('./Project');
var FileUtil = require('../lib/FileUtil');
var server = require('../server/server');
var Create = (function (_super) {
    __extends(Create, _super);
    function Create() {
        _super.apply(this, arguments);
    }
    Create.prototype.run = function () {
        _super.prototype.run.call(this);
        var option = this.options;
        FileUtil.createDirectory(option.srcDir);
        FileUtil.createDirectory(option.debugDir);
        lark.options.project = new Project();
        lark.options.project.save();
        server.startServer(option, option.manageUrl + "create/");
        return 0;
    };
    Create.prototype.doCreate = function (projJson, callback) {
        var proj = new Project();
        proj.parse(projJson);
        this.options.project = proj;
        proj.save();
        var template = FileUtil.joinPath(lark.options.larkRoot, "tools/templates/" + proj.template);
        FileUtil.copy(template, lark.options.projectDir);
        this.copyLark();
        this.copyTemplate();
        var build = new Build(this.options);
        build.buildProject();
        FileUtil.remove(this.options.larkPropertiesFile);
        callback();
    };
    return Create;
})(Action);
module.exports = Create;
//# sourceMappingURL=Create.js.map