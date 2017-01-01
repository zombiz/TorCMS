"use strict";!function(a,b){"function"==typeof define&&define.amd?define(["leaflet"],a):"object"==typeof exports&&(module.exports=a(require("leaflet"))),"undefined"!=typeof b&&b.L&&a(b.L)}(function(a){a.Editable=a.Evented.extend({statics:{FORWARD:1,BACKWARD:-1},options:{zIndex:1e3,polygonClass:a.Polygon,polylineClass:a.Polyline,markerClass:a.Marker,rectangleClass:a.Rectangle,circleClass:a.Circle,drawingCSSClass:"leaflet-editable-drawing",drawingCursor:"crosshair",editLayer:void 0,featuresLayer:void 0,polylineEditorClass:void 0,polygonEditorClass:void 0,markerEditorClass:void 0,rectangleEditorClass:void 0,circleEditorClass:void 0,lineGuideOptions:{},skipMiddleMarkers:!1},initialize:function(b,c){a.setOptions(this,c),this._lastZIndex=this.options.zIndex,this.map=b,this.editLayer=this.createEditLayer(),this.featuresLayer=this.createFeaturesLayer(),this.forwardLineGuide=this.createLineGuide(),this.backwardLineGuide=this.createLineGuide()},fireAndForward:function(a,b){b=b||{},b.editTools=this,this.fire(a,b),this.map.fire(a,b)},createLineGuide:function(){var b=a.extend({dashArray:"5,10",weight:1,interactive:!1},this.options.lineGuideOptions);return a.polyline([],b)},createVertexIcon:function(b){return a.Browser.touch?new a.Editable.TouchVertexIcon(b):new a.Editable.VertexIcon(b)},createEditLayer:function(){return this.options.editLayer||(new a.LayerGroup).addTo(this.map)},createFeaturesLayer:function(){return this.options.featuresLayer||(new a.LayerGroup).addTo(this.map)},moveForwardLineGuide:function(a){this.forwardLineGuide._latlngs.length&&(this.forwardLineGuide._latlngs[1]=a,this.forwardLineGuide._bounds.extend(a),this.forwardLineGuide.redraw())},moveBackwardLineGuide:function(a){this.backwardLineGuide._latlngs.length&&(this.backwardLineGuide._latlngs[1]=a,this.backwardLineGuide._bounds.extend(a),this.backwardLineGuide.redraw())},anchorForwardLineGuide:function(a){this.forwardLineGuide._latlngs[0]=a,this.forwardLineGuide._bounds.extend(a),this.forwardLineGuide.redraw()},anchorBackwardLineGuide:function(a){this.backwardLineGuide._latlngs[0]=a,this.backwardLineGuide._bounds.extend(a),this.backwardLineGuide.redraw()},attachForwardLineGuide:function(){this.editLayer.addLayer(this.forwardLineGuide)},attachBackwardLineGuide:function(){this.editLayer.addLayer(this.backwardLineGuide)},detachForwardLineGuide:function(){this.forwardLineGuide.setLatLngs([]),this.editLayer.removeLayer(this.forwardLineGuide)},detachBackwardLineGuide:function(){this.backwardLineGuide.setLatLngs([]),this.editLayer.removeLayer(this.backwardLineGuide)},blockEvents:function(){this._oldTargets||(this._oldTargets=this.map._targets,this.map._targets={})},unblockEvents:function(){this._oldTargets&&(this.map._targets=a.extend(this.map._targets,this._oldTargets),delete this._oldTargets)},registerForDrawing:function(b){this._drawingEditor&&this.unregisterForDrawing(this._drawingEditor),this.map.on("mousemove touchmove",b.onDrawingMouseMove,b),this.blockEvents(),b.reset(),this._drawingEditor=b,this.map.on("mousedown",this.onMousedown,this),this.map.on("mouseup",this.onMouseup,this),a.DomUtil.addClass(this.map._container,this.options.drawingCSSClass),this.defaultMapCursor=this.map._container.style.cursor,this.map._container.style.cursor=this.options.drawingCursor},unregisterForDrawing:function(b){this.unblockEvents(),a.DomUtil.removeClass(this.map._container,this.options.drawingCSSClass),this.map._container.style.cursor=this.defaultMapCursor,b=b||this._drawingEditor,b&&(this.map.off("mousemove touchmove",b.onDrawingMouseMove,b),this.map.off("mousedown",this.onMousedown,this),this.map.off("mouseup",this.onMouseup,this),b===this._drawingEditor&&(delete this._drawingEditor,b._drawing&&b.cancelDrawing()))},onMousedown:function(a){this._mouseDown=a,this._drawingEditor.onDrawingMouseDown(a)},onMouseup:function(b){if(this._mouseDown){var c=this._drawingEditor,d=this._mouseDown;if(this._mouseDown=null,c.onDrawingMouseUp(b),this._drawingEditor!==c)return;var e=a.point(d.originalEvent.clientX,d.originalEvent.clientY),f=a.point(b.originalEvent.clientX,b.originalEvent.clientY).distanceTo(e);Math.abs(f)<9*(window.devicePixelRatio||1)&&this._drawingEditor.onDrawingClick(b)}},drawing:function(){return this._drawingEditor&&this._drawingEditor.drawing()},stopDrawing:function(){this.unregisterForDrawing()},commitDrawing:function(a){this._drawingEditor&&this._drawingEditor.commitDrawing(a)},connectCreatedToMap:function(a){return this.featuresLayer.addLayer(a)},startPolyline:function(a,b){var c=this.createPolyline([],b);return c.enableEdit(this.map).newShape(a),c},startPolygon:function(a,b){var c=this.createPolygon([],b);return c.enableEdit(this.map).newShape(a),c},startMarker:function(a,b){a=a||this.map.getCenter().clone();var c=this.createMarker(a,b);return c.enableEdit(this.map).startDrawing(),c},startRectangle:function(b,c){var d=b||a.latLng([0,0]),e=new a.LatLngBounds(d,d),f=this.createRectangle(e,c);return f.enableEdit(this.map).startDrawing(),f},startCircle:function(a,b){a=a||this.map.getCenter().clone();var c=this.createCircle(a,b);return c.enableEdit(this.map).startDrawing(),c},startHole:function(a,b){a.newHole(b)},createLayer:function(b,c,d){d=a.Util.extend({editOptions:{editTools:this}},d);var e=new b(c,d);return this.fireAndForward("editable:created",{layer:e}),e},createPolyline:function(a,b){return this.createLayer(b&&b.polylineClass||this.options.polylineClass,a,b)},createPolygon:function(a,b){return this.createLayer(b&&b.polygonClass||this.options.polygonClass,a,b)},createMarker:function(a,b){return this.createLayer(b&&b.markerClass||this.options.markerClass,a,b)},createRectangle:function(a,b){return this.createLayer(b&&b.rectangleClass||this.options.rectangleClass,a,b)},createCircle:function(a,b){return this.createLayer(b&&b.circleClass||this.options.circleClass,a,b)}}),a.extend(a.Editable,{makeCancellable:function(a){a.cancel=function(){a._cancelled=!0}}}),a.Map.mergeOptions({editToolsClass:a.Editable,editable:!1,editOptions:{}}),a.Map.addInitHook(function(){this.whenReady(function(){this.options.editable&&(this.editTools=new this.options.editToolsClass(this,this.options.editOptions))})}),a.Editable.VertexIcon=a.DivIcon.extend({options:{iconSize:new a.Point(8,8)}}),a.Editable.TouchVertexIcon=a.Editable.VertexIcon.extend({options:{iconSize:new a.Point(20,20)}}),a.Editable.VertexMarker=a.Marker.extend({options:{draggable:!0,className:"leaflet-div-icon leaflet-vertex-icon"},initialize:function(b,c,d,e){this.latlng=b,this.latlngs=c,this.editor=d,a.Marker.prototype.initialize.call(this,b,e),this.options.icon=this.editor.tools.createVertexIcon({className:this.options.className}),this.latlng.__vertex=this,this.editor.editLayer.addLayer(this),this.setZIndexOffset(d.tools._lastZIndex+1)},onAdd:function(b){a.Marker.prototype.onAdd.call(this,b),this.on("drag",this.onDrag),this.on("dragstart",this.onDragStart),this.on("dragend",this.onDragEnd),this.on("mouseup",this.onMouseup),this.on("click",this.onClick),this.on("contextmenu",this.onContextMenu),this.on("mousedown touchstart",this.onMouseDown),this.addMiddleMarkers()},onRemove:function(b){this.middleMarker&&this.middleMarker.delete(),delete this.latlng.__vertex,this.off("drag",this.onDrag),this.off("dragstart",this.onDragStart),this.off("dragend",this.onDragEnd),this.off("mouseup",this.onMouseup),this.off("click",this.onClick),this.off("contextmenu",this.onContextMenu),this.off("mousedown touchstart",this.onMouseDown),a.Marker.prototype.onRemove.call(this,b)},onDrag:function(b){b.vertex=this,this.editor.onVertexMarkerDrag(b);var c=a.DomUtil.getPosition(this._icon),d=this._map.layerPointToLatLng(c);this.latlng.update(d),this._latlng=this.latlng,this.editor.refresh(),this.middleMarker&&this.middleMarker.updateLatLng();var e=this.getNext();e&&e.middleMarker&&e.middleMarker.updateLatLng()},onDragStart:function(a){a.vertex=this,this.editor.onVertexMarkerDragStart(a)},onDragEnd:function(a){a.vertex=this,this.editor.onVertexMarkerDragEnd(a)},onClick:function(a){a.vertex=this,this.editor.onVertexMarkerClick(a)},onMouseup:function(b){a.DomEvent.stop(b),b.vertex=this,this.editor.map.fire("mouseup",b)},onContextMenu:function(a){a.vertex=this,this.editor.onVertexMarkerContextMenu(a)},onMouseDown:function(a){a.vertex=this,this.editor.onVertexMarkerMouseDown(a)},delete:function(){var a=this.getNext();this.latlngs.splice(this.getIndex(),1),this.editor.editLayer.removeLayer(this),this.editor.onVertexDeleted({latlng:this.latlng,vertex:this}),this.latlngs.length||this.editor.deleteShape(this.latlngs),a&&a.resetMiddleMarker(),this.editor.refresh()},getIndex:function(){return this.latlngs.indexOf(this.latlng)},getLastIndex:function(){return this.latlngs.length-1},getPrevious:function(){if(!(this.latlngs.length<2)){var a=this.getIndex(),b=a-1;0===a&&this.editor.CLOSED&&(b=this.getLastIndex());var c=this.latlngs[b];return c?c.__vertex:void 0}},getNext:function(){if(!(this.latlngs.length<2)){var a=this.getIndex(),b=a+1;a===this.getLastIndex()&&this.editor.CLOSED&&(b=0);var c=this.latlngs[b];return c?c.__vertex:void 0}},addMiddleMarker:function(a){this.editor.hasMiddleMarkers()&&(a=a||this.getPrevious(),a&&!this.middleMarker&&(this.middleMarker=this.editor.addMiddleMarker(a,this,this.latlngs,this.editor)))},addMiddleMarkers:function(){if(this.editor.hasMiddleMarkers()){var a=this.getPrevious();a&&this.addMiddleMarker(a);var b=this.getNext();b&&b.resetMiddleMarker()}},resetMiddleMarker:function(){this.middleMarker&&this.middleMarker.delete(),this.addMiddleMarker()},split:function(){this.editor.splitShape&&this.editor.splitShape(this.latlngs,this.getIndex())},continue:function(){if(this.editor.continueBackward){var a=this.getIndex();0===a?this.editor.continueBackward(this.latlngs):a===this.getLastIndex()&&this.editor.continueForward(this.latlngs)}}}),a.Editable.mergeOptions({vertexMarkerClass:a.Editable.VertexMarker}),a.Editable.MiddleMarker=a.Marker.extend({options:{opacity:.5,className:"leaflet-div-icon leaflet-middle-icon",draggable:!0},initialize:function(b,c,d,e,f){this.left=b,this.right=c,this.editor=e,this.latlngs=d,a.Marker.prototype.initialize.call(this,this.computeLatLng(),f),this._opacity=this.options.opacity,this.options.icon=this.editor.tools.createVertexIcon({className:this.options.className}),this.editor.editLayer.addLayer(this),this.setVisibility()},setVisibility:function(){var b=this._map.latLngToContainerPoint(this.left.latlng),c=this._map.latLngToContainerPoint(this.right.latlng),d=a.point(this.options.icon.options.iconSize);b.distanceTo(c)<3*d.x?this.hide():this.show()},show:function(){this.setOpacity(this._opacity)},hide:function(){this.setOpacity(0)},updateLatLng:function(){this.setLatLng(this.computeLatLng()),this.setVisibility()},computeLatLng:function(){var a=this.editor.map.latLngToContainerPoint(this.left.latlng),b=this.editor.map.latLngToContainerPoint(this.right.latlng),c=(a.y+b.y)/2,d=(a.x+b.x)/2;return this.editor.map.containerPointToLatLng([d,c])},onAdd:function(b){a.Marker.prototype.onAdd.call(this,b),a.DomEvent.on(this._icon,"mousedown touchstart",this.onMouseDown,this),b.on("zoomend",this.setVisibility,this)},onRemove:function(b){delete this.right.middleMarker,a.DomEvent.off(this._icon,"mousedown touchstart",this.onMouseDown,this),b.off("zoomend",this.setVisibility,this),a.Marker.prototype.onRemove.call(this,b)},onMouseDown:function(b){var c=a.DomUtil.getPosition(this._icon),d=this.editor.map.layerPointToLatLng(c);if(b={originalEvent:b,latlng:d},0!==this.options.opacity&&(a.Editable.makeCancellable(b),this.editor.onMiddleMarkerMouseDown(b),!b._cancelled)){this.latlngs.splice(this.index(),0,b.latlng),this.editor.refresh();var e=this._icon,f=this.editor.addVertexMarker(b.latlng,this.latlngs),g=f._icon.parentNode;g.removeChild(f._icon),f._icon=e,g.appendChild(f._icon),f._initIcon(),f._initInteraction(),f.setOpacity(1),a.Draggable._dragging=!1,f.dragging._draggable._onDown(b.originalEvent),this.delete()}},delete:function(){this.editor.editLayer.removeLayer(this)},index:function(){return this.latlngs.indexOf(this.right.latlng)}}),a.Editable.mergeOptions({middleMarkerClass:a.Editable.MiddleMarker}),a.Editable.BaseEditor=a.Handler.extend({initialize:function(b,c,d){a.setOptions(this,d),this.map=b,this.feature=c,this.feature.editor=this,this.editLayer=new a.LayerGroup,this.tools=this.options.editTools||b.editTools},addHooks:function(){this.isConnected()?this.onFeatureAdd():this.feature.once("add",this.onFeatureAdd,this),this.onEnable(),this.feature.on(this._getEvents(),this)},removeHooks:function(){this.feature.off(this._getEvents(),this),this.feature.dragging&&this.feature.dragging.disable(),this.editLayer.clearLayers(),this.tools.editLayer.removeLayer(this.editLayer),this.onDisable(),this._drawing&&this.cancelDrawing()},drawing:function(){return!!this._drawing},reset:function(){},onFeatureAdd:function(){this.tools.editLayer.addLayer(this.editLayer),this.feature.dragging&&this.feature.dragging.enable()},hasMiddleMarkers:function(){return!this.options.skipMiddleMarkers&&!this.tools.options.skipMiddleMarkers},fireAndForward:function(a,b){b=b||{},b.layer=this.feature,this.feature.fire(a,b),this.tools.fireAndForward(a,b)},onEnable:function(){this.fireAndForward("editable:enable")},onDisable:function(){this.fireAndForward("editable:disable")},onEditing:function(){this.fireAndForward("editable:editing")},onStartDrawing:function(){this.fireAndForward("editable:drawing:start")},onEndDrawing:function(){this.fireAndForward("editable:drawing:end")},onCancelDrawing:function(){this.fireAndForward("editable:drawing:cancel")},onCommitDrawing:function(a){this.fireAndForward("editable:drawing:commit",a)},onDrawingMouseDown:function(a){this.fireAndForward("editable:drawing:mousedown",a)},onDrawingMouseUp:function(a){this.fireAndForward("editable:drawing:mouseup",a)},startDrawing:function(){this._drawing||(this._drawing=a.Editable.FORWARD),this.tools.registerForDrawing(this),this.onStartDrawing()},commitDrawing:function(a){this.onCommitDrawing(a),this.endDrawing()},cancelDrawing:function(){a.Draggable._dragging=!1,this.onCancelDrawing(),this.endDrawing()},endDrawing:function(){this._drawing=!1,this.tools.unregisterForDrawing(this),this.onEndDrawing()},onDrawingClick:function(b){this.drawing()&&(a.Editable.makeCancellable(b),this.fireAndForward("editable:drawing:click",b),b._cancelled||(this.isConnected()||this.connect(b),this.processDrawingClick(b)))},isConnected:function(){return this.map.hasLayer(this.feature)},connect:function(a){this.tools.connectCreatedToMap(this.feature),this.tools.editLayer.addLayer(this.editLayer)},onMove:function(a){this.fireAndForward("editable:drawing:move",a)},onDrawingMouseMove:function(a){this.onMove(a)},_getEvents:function(){return{dragstart:this.onDragStart,drag:this.onDrag,dragend:this.onDragEnd,remove:this.disable}},onDragStart:function(a){this.onEditing(),this.fireAndForward("editable:dragstart",a)},onDrag:function(a){this.onMove(a),this.fireAndForward("editable:drag",a)},onDragEnd:function(a){this.fireAndForward("editable:dragend",a)}}),a.Editable.MarkerEditor=a.Editable.BaseEditor.extend({onDrawingMouseMove:function(b){a.Editable.BaseEditor.prototype.onDrawingMouseMove.call(this,b),this._drawing&&this.feature.setLatLng(b.latlng)},processDrawingClick:function(a){this.fireAndForward("editable:drawing:clicked",a),this.commitDrawing(a)},connect:function(b){b&&(this.feature._latlng=b.latlng),a.Editable.BaseEditor.prototype.connect.call(this,b)}}),a.Editable.PathEditor=a.Editable.BaseEditor.extend({CLOSED:!1,MIN_VERTEX:2,addHooks:function(){return a.Editable.BaseEditor.prototype.addHooks.call(this),this.feature&&this.initVertexMarkers(),this},initVertexMarkers:function(b){if(this.enabled())if(b=b||this.getLatLngs(),a.Polyline._flat(b))this.addVertexMarkers(b);else for(var c=0;c<b.length;c++)this.initVertexMarkers(b[c])},getLatLngs:function(){return this.feature.getLatLngs()},reset:function(){this.editLayer.clearLayers(),this.initVertexMarkers()},addVertexMarker:function(a,b){return new this.tools.options.vertexMarkerClass(a,b,this)},addVertexMarkers:function(a){for(var b=0;b<a.length;b++)this.addVertexMarker(a[b],a)},refreshVertexMarkers:function(a){a=a||this.getDefaultLatLngs();for(var b=0;b<a.length;b++)a[b].__vertex.update()},addMiddleMarker:function(a,b,c){return new this.tools.options.middleMarkerClass(a,b,c,this)},onVertexMarkerClick:function(b){if(a.Editable.makeCancellable(b),this.fireAndForward("editable:vertex:click",b),!(b._cancelled||this.tools.drawing()&&this.tools._drawingEditor!==this)){var c,d=b.vertex.getIndex();b.originalEvent.ctrlKey?this.onVertexMarkerCtrlClick(b):b.originalEvent.altKey?this.onVertexMarkerAltClick(b):b.originalEvent.shiftKey?this.onVertexMarkerShiftClick(b):b.originalEvent.metaKey?this.onVertexMarkerMetaKeyClick(b):d===b.vertex.getLastIndex()&&this._drawing===a.Editable.FORWARD?d>=this.MIN_VERTEX-1&&(c=!0):0===d&&this._drawing===a.Editable.BACKWARD&&this._drawnLatLngs.length>=this.MIN_VERTEX?c=!0:0===d&&this._drawing===a.Editable.FORWARD&&this._drawnLatLngs.length>=this.MIN_VERTEX&&this.CLOSED?c=!0:this.onVertexRawMarkerClick(b),this.fireAndForward("editable:vertex:clicked",b),c&&this.commitDrawing(b)}},onVertexRawMarkerClick:function(a){this.fireAndForward("editable:vertex:rawclick",a),a._cancelled||this.vertexCanBeDeleted(a.vertex)&&a.vertex.delete()},vertexCanBeDeleted:function(a){return a.latlngs.length>this.MIN_VERTEX},onVertexDeleted:function(a){this.fireAndForward("editable:vertex:deleted",a)},onVertexMarkerCtrlClick:function(a){this.fireAndForward("editable:vertex:ctrlclick",a)},onVertexMarkerShiftClick:function(a){this.fireAndForward("editable:vertex:shiftclick",a)},onVertexMarkerMetaKeyClick:function(a){this.fireAndForward("editable:vertex:metakeyclick",a)},onVertexMarkerAltClick:function(a){this.fireAndForward("editable:vertex:altclick",a)},onVertexMarkerContextMenu:function(a){this.fireAndForward("editable:vertex:contextmenu",a)},onVertexMarkerMouseDown:function(a){this.fireAndForward("editable:vertex:mousedown",a)},onMiddleMarkerMouseDown:function(a){this.fireAndForward("editable:middlemarker:mousedown",a)},onVertexMarkerDrag:function(a){this.onMove(a),this.feature._bounds&&this.extendBounds(a),this.fireAndForward("editable:vertex:drag",a)},onVertexMarkerDragStart:function(a){this.fireAndForward("editable:vertex:dragstart",a)},onVertexMarkerDragEnd:function(a){this.fireAndForward("editable:vertex:dragend",a)},setDrawnLatLngs:function(a){this._drawnLatLngs=a||this.getDefaultLatLngs()},startDrawing:function(){this._drawnLatLngs||this.setDrawnLatLngs(),a.Editable.BaseEditor.prototype.startDrawing.call(this)},startDrawingForward:function(){this.startDrawing()},endDrawing:function(){this.tools.detachForwardLineGuide(),this.tools.detachBackwardLineGuide(),this._drawnLatLngs&&this._drawnLatLngs.length<this.MIN_VERTEX&&this.deleteShape(this._drawnLatLngs),a.Editable.BaseEditor.prototype.endDrawing.call(this),delete this._drawnLatLngs},addLatLng:function(b){this._drawing===a.Editable.FORWARD?this._drawnLatLngs.push(b):this._drawnLatLngs.unshift(b),this.feature._bounds.extend(b),this.addVertexMarker(b,this._drawnLatLngs),this.refresh()},newPointForward:function(a){this.addLatLng(a),this.tools.attachForwardLineGuide(),this.tools.anchorForwardLineGuide(a)},newPointBackward:function(a){this.addLatLng(a),this.tools.anchorBackwardLineGuide(a)},push:function(b){return b?void(this._drawing===a.Editable.FORWARD?this.newPointForward(b):this.newPointBackward(b)):console.error("L.Editable.PathEditor.push expect a vaild latlng as parameter")},removeLatLng:function(a){a.__vertex.delete(),this.refresh()},pop:function(){if(!(this._drawnLatLngs.length<=1)){var b;return b=this._drawing===a.Editable.FORWARD?this._drawnLatLngs[this._drawnLatLngs.length-1]:this._drawnLatLngs[0],this.removeLatLng(b),this._drawing===a.Editable.FORWARD?this.tools.anchorForwardLineGuide(this._drawnLatLngs[this._drawnLatLngs.length-1]):this.tools.anchorForwardLineGuide(this._drawnLatLngs[0]),b}},processDrawingClick:function(b){b.vertex&&b.vertex.editor===this||(this._drawing===a.Editable.FORWARD?this.newPointForward(b.latlng):this.newPointBackward(b.latlng),this.fireAndForward("editable:drawing:clicked",b))},onDrawingMouseMove:function(b){a.Editable.BaseEditor.prototype.onDrawingMouseMove.call(this,b),this._drawing&&(this.tools.moveForwardLineGuide(b.latlng),this.tools.moveBackwardLineGuide(b.latlng))},refresh:function(){this.feature.redraw(),this.onEditing()},newShape:function(a){var b=this.addNewEmptyShape();b&&(this.setDrawnLatLngs(b[0]||b),this.startDrawingForward(),this.fireAndForward("editable:shape:new",{shape:b}),a&&this.newPointForward(a))},deleteShape:function(b,c){var d={shape:b};if(a.Editable.makeCancellable(d),this.fireAndForward("editable:shape:delete",d),!d._cancelled)return b=this._deleteShape(b,c),this.ensureNotFlat&&this.ensureNotFlat(),this.feature.setLatLngs(this.getLatLngs()),this.refresh(),this.reset(),this.fireAndForward("editable:shape:deleted",{shape:b}),b},_deleteShape:function(a,b){if(b=b||this.getLatLngs(),b.length){var c=this,d=function(a,b){return b=a.splice(0,Number.MAX_VALUE)},e=function(a,b){return a.splice(a.indexOf(b),1),a.length||c._deleteShape(a),b};if(b===a)return d(b,a);for(var f=0;f<b.length;f++){if(b[f]===a)return e(b,a);if(b[f].indexOf(a)!==-1)return e(b[f],a)}}},deleteShapeAt:function(a){var b=this.feature.shapeAt(a);if(b)return this.deleteShape(b)},appendShape:function(a){this.insertShape(a)},prependShape:function(a){this.insertShape(a,0)},insertShape:function(a,b){this.ensureMulti(),a=this.formatShape(a),"undefined"==typeof b&&(b=this.feature._latlngs.length),this.feature._latlngs.splice(b,0,a),this.feature.redraw(),this._enabled&&this.reset()},extendBounds:function(a){this.feature._bounds.extend(a.vertex.latlng)},onDragStart:function(b){this.editLayer.clearLayers(),a.Editable.BaseEditor.prototype.onDragStart.call(this,b)},onDragEnd:function(b){this.initVertexMarkers(),a.Editable.BaseEditor.prototype.onDragEnd.call(this,b)}}),a.Editable.PolylineEditor=a.Editable.PathEditor.extend({startDrawingBackward:function(){this._drawing=a.Editable.BACKWARD,this.startDrawing()},continueBackward:function(a){this.drawing()||(a=a||this.getDefaultLatLngs(),this.setDrawnLatLngs(a),a.length>0&&(this.tools.attachBackwardLineGuide(),this.tools.anchorBackwardLineGuide(a[0])),this.startDrawingBackward())},continueForward:function(a){this.drawing()||(a=a||this.getDefaultLatLngs(),this.setDrawnLatLngs(a),a.length>0&&(this.tools.attachForwardLineGuide(),this.tools.anchorForwardLineGuide(a[a.length-1])),this.startDrawingForward())},getDefaultLatLngs:function(b){return b=b||this.feature._latlngs,!b.length||b[0]instanceof a.LatLng?b:this.getDefaultLatLngs(b[0])},ensureMulti:function(){this.feature._latlngs.length&&a.Polyline._flat(this.feature._latlngs)&&(this.feature._latlngs=[this.feature._latlngs])},addNewEmptyShape:function(){if(this.feature._latlngs.length){var a=[];return this.appendShape(a),a}return this.feature._latlngs},formatShape:function(b){return a.Polyline._flat(b)?b:b[0]?this.formatShape(b[0]):void 0},splitShape:function(b,c){if(c&&!(c>=b.length-1)){this.ensureMulti();var d=this.feature._latlngs.indexOf(b);if(d!==-1){var e=b.slice(0,c+1),f=b.slice(c);f[0]=a.latLng(f[0].lat,f[0].lng,f[0].alt),this.feature._latlngs.splice(d,1,e,f),this.refresh(),this.reset()}}}}),a.Editable.PolygonEditor=a.Editable.PathEditor.extend({CLOSED:!0,MIN_VERTEX:3,newPointForward:function(b){a.Editable.PathEditor.prototype.newPointForward.call(this,b),this.tools.backwardLineGuide._latlngs.length||this.tools.anchorBackwardLineGuide(b),2===this._drawnLatLngs.length&&this.tools.attachBackwardLineGuide()},addNewEmptyHole:function(a){this.ensureNotFlat();var b=this.feature.shapeAt(a);if(b){var c=[];return b.push(c),c}},newHole:function(a){var b=this.addNewEmptyHole(a);b&&(this.setDrawnLatLngs(b),this.startDrawingForward(),a&&this.newPointForward(a))},addNewEmptyShape:function(){if(this.feature._latlngs.length&&this.feature._latlngs[0].length){var a=[];return this.appendShape(a),a}return this.feature._latlngs},ensureMulti:function(){this.feature._latlngs.length&&a.Polyline._flat(this.feature._latlngs[0])&&(this.feature._latlngs=[this.feature._latlngs])},ensureNotFlat:function(){this.feature._latlngs.length&&!a.Polyline._flat(this.feature._latlngs)||(this.feature._latlngs=[this.feature._latlngs])},vertexCanBeDeleted:function(b){var c=this.feature.parentShape(b.latlngs),d=a.Util.indexOf(c,b.latlngs);return d>0||a.Editable.PathEditor.prototype.vertexCanBeDeleted.call(this,b)},getDefaultLatLngs:function(){return this.feature._latlngs.length||this.feature._latlngs.push([]),this.feature._latlngs[0]},formatShape:function(b){return!a.Polyline._flat(b)||b[0]&&0===b[0].length?b:[b]}}),a.Editable.RectangleEditor=a.Editable.PathEditor.extend({CLOSED:!0,MIN_VERTEX:4,options:{skipMiddleMarkers:!0},extendBounds:function(b){var c=b.vertex.getIndex(),d=b.vertex.getNext(),e=b.vertex.getPrevious(),f=(c+2)%4,g=b.vertex.latlngs[f],h=new a.LatLngBounds(b.latlng,g);e.latlng.update([b.latlng.lat,g.lng]),d.latlng.update([g.lat,b.latlng.lng]),this.updateBounds(h),this.refreshVertexMarkers()},onDrawingMouseDown:function(b){a.Editable.PathEditor.prototype.onDrawingMouseDown.call(this,b),this.connect();var c=this.getDefaultLatLngs();3===c.length&&c.push(b.latlng);var d=new a.LatLngBounds(b.latlng,b.latlng);this.updateBounds(d),this.updateLatLngs(d),this.refresh(),this.reset(),this.map.dragging._draggable._onUp(b.originalEvent),c[3].__vertex.dragging._draggable._onDown(b.originalEvent)},onDrawingMouseUp:function(b){this.commitDrawing(b),a.Editable.PathEditor.prototype.onDrawingMouseUp.call(this,b)},getDefaultLatLngs:function(a){return a||this.feature._latlngs[0]},updateBounds:function(a){this.feature._bounds=a},updateLatLngs:function(a){for(var b=this.getDefaultLatLngs(),c=this.feature._boundsToLatLngs(a),d=0;d<b.length;d++)b[d].update(c[d])}}),a.Editable.CircleEditor=a.Editable.PathEditor.extend({MIN_VERTEX:2,options:{skipMiddleMarkers:!0},initialize:function(b,c,d){a.Editable.PathEditor.prototype.initialize.call(this,b,c,d),this._resizeLatLng=this.computeResizeLatLng()},computeResizeLatLng:function(){var a=(this.feature._radius||this.feature._mRadius)*Math.cos(Math.PI/4),b=this.map.project(this.feature._latlng);return this.map.unproject([b.x+a,b.y-a])},updateResizeLatLng:function(){this._resizeLatLng.update(this.computeResizeLatLng()),this._resizeLatLng.__vertex.update()},getLatLngs:function(){return[this.feature._latlng,this._resizeLatLng]},getDefaultLatLngs:function(){return this.getLatLngs()},onVertexMarkerDrag:function(b){1===b.vertex.getIndex()?this.resize(b):this.updateResizeLatLng(b),a.Editable.PathEditor.prototype.onVertexMarkerDrag.call(this,b)},resize:function(a){var b=this.feature._latlng.distanceTo(a.latlng);this.feature.setRadius(b)},onDrawingMouseDown:function(b){a.Editable.PathEditor.prototype.onDrawingMouseDown.call(this,b),this._resizeLatLng.update(b.latlng),this.feature._latlng.update(b.latlng),this.connect(),this.map.dragging._draggable._onUp(b.originalEvent),this._resizeLatLng.__vertex.dragging._draggable._onDown(b.originalEvent)},onDrawingMouseUp:function(b){this.commitDrawing(b),a.Editable.PathEditor.prototype.onDrawingMouseUp.call(this,b)},onDrag:function(b){a.Editable.PathEditor.prototype.onDrag.call(this,b),this.feature.dragging.updateLatLng(this._resizeLatLng)}});var b={createEditor:function(a){a=a||this._map;var b=(this.options.editOptions||{}).editTools||a.editTools;if(!b)throw Error("Unable to detect Editable instance.");var c=this.options.editorClass||this.getEditorClass(b);return new c(a,this,this.options.editOptions)},enableEdit:function(a){return this.editor||this.createEditor(a),this.editor.enable(),this.editor},editEnabled:function(){return this.editor&&this.editor.enabled()},disableEdit:function(){this.editor&&(this.editor.disable(),delete this.editor)},toggleEdit:function(){this.editEnabled()?this.disableEdit():this.enableEdit()},_onEditableAdd:function(){this.editor&&this.enableEdit()}},c={getEditorClass:function(b){return b&&b.options.polylineEditorClass?b.options.polylineEditorClass:a.Editable.PolylineEditor},shapeAt:function(b,c){var d=null;if(c=c||this._latlngs,!c.length)return d;if(a.Polyline._flat(c)&&this.isInLatLngs(b,c))d=c;else for(var e=0;e<c.length;e++)if(this.isInLatLngs(b,c[e]))return c[e];return d},isInLatLngs:function(b,c){if(!c)return!1;var d,e,f,g,h=[],i=this._clickTolerance();if(this._projectLatlngs(c,h,this._pxBounds),h=h[0],g=this._map.latLngToLayerPoint(b),!this._pxBounds.contains(g))return!1;for(d=1,f=h.length,e=0;d<f;e=d++)if(a.LineUtil.pointToSegmentDistance(g,h[e],h[d])<=i)return!0;return!1}},d={getEditorClass:function(b){return b&&b.options.polygonEditorClass?b.options.polygonEditorClass:a.Editable.PolygonEditor},shapeAt:function(b,c){var d=null;if(c=c||this._latlngs,!c.length)return d;if(a.Polyline._flat(c)&&this.isInLatLngs(b,c))d=c;else if(a.Polyline._flat(c[0])&&this.isInLatLngs(b,c[0]))d=c;else for(var e=0;e<c.length;e++)if(this.isInLatLngs(b,c[e][0]))return c[e];return d},isInLatLngs:function(a,b){var c,d,e,f,g,h=!1;for(e=0,g=b.length,f=g-1;e<g;f=e++)c=b[e],d=b[f],c.lat>a.lat!=d.lat>a.lat&&a.lng<(d.lng-c.lng)*(a.lat-c.lat)/(d.lat-c.lat)+c.lng&&(h=!h);return h},parentShape:function(b,c){if(c=c||this._latlngs){var d=a.Util.indexOf(c,b);if(d!==-1)return c;for(var e=0;e<c.length;e++)if(d=a.Util.indexOf(c[e],b),d!==-1)return c[e]}}},e={getEditorClass:function(b){return b&&b.options.markerEditorClass?b.options.markerEditorClass:a.Editable.MarkerEditor}},f={getEditorClass:function(b){return b&&b.options.rectangleEditorClass?b.options.rectangleEditorClass:a.Editable.RectangleEditor}},g={getEditorClass:function(b){return b&&b.options.circleEditorClass?b.options.circleEditorClass:a.Editable.CircleEditor}},h=function(){this.on("add",this._onEditableAdd)};a.Polyline&&(a.Polyline.include(b),a.Polyline.include(c),a.Polyline.addInitHook(h)),a.Polygon&&(a.Polygon.include(b),a.Polygon.include(d)),a.Marker&&(a.Marker.include(b),a.Marker.include(e),a.Marker.addInitHook(h)),a.Rectangle&&(a.Rectangle.include(b),a.Rectangle.include(f)),a.Circle&&(a.Circle.include(b),a.Circle.include(g)),a.LatLng.prototype.update=function(b){b=a.latLng(b),this.lat=b.lat,this.lng=b.lng}},window);