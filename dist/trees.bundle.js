!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.trees=e()}}(function(){return function e(t,i,r){function n(l,s){if(!i[l]){if(!t[l]){var c="function"==typeof require&&require;if(!s&&c)return c(l,!0);if(o)return o(l,!0);var a=new Error("Cannot find module '"+l+"'");throw a.code="MODULE_NOT_FOUND",a}var d=i[l]={exports:{}};t[l][0].call(d.exports,function(e){var i=t[l][1][e];return n(i?i:e)},d,d.exports,e,t,i,r)}return i[l].exports}for(var o="function"==typeof require&&require,l=0;l<r.length;l++)n(r[l]);return n}({1:[function(e,t,i){(function(i){function r(e,t){if(void 0===r)var r=i.document;if(void 0===n)var n=i;c.maxIndex=0,this.dom=r.getElementById(e),t||(t={}),t.clear?this.clearable=t.clear:this.clearable=!1,t.height?this.dom.setAttribute("height",t.height):(this.height=Number(this.dom.getAttribute("height")),0==this.height&&this.dom.setAttribute("height",200)),this.setPosition(),t.width?this.dom.setAttribute("width",t.width):(this.width=Number(this.dom.getAttribute("width")),0==this.width&&this.dom.setAttribute("width",200)),t.scale?this.scale=t.scale:this.scale=1,this.coords={x:0,y:0},this.prevScale=this.scale,this.setScale(this.scale);var o=this;this.dom.addEventListener("wheel",function(e){o.setScale(o.scale+o.scale*e.deltaY/1e3,{ex:e.clientX,ey:e.clientY})}),this.pinching={status:!1,p1:{x:0,y:0},p2:{x:0,y:0}},this.dom.addEventListener("touchstart",function(e){2==e.touches.length&&(o.pinching.status=!0,o.pinching.p1.x=e.touches[0].clientX,o.pinching.p1.y=e.touches[0].clientY,o.pinching.p2.x=e.touches[1].clientX,o.pinching.p2.y=e.touches[1].clientY)}),this.dom.addEventListener("touchmove",function(e){if(2==e.touches.length&&o.pinching.status){var t=(o.pinching.p1.x-o.pinching.p2.x)*(o.pinching.p1.x-o.pinching.p2.x)+(o.pinching.p1.y-o.pinching.p2.y)*(o.pinching.p1.y-o.pinching.p2.y),i=(e.touches[0].clientX-e.touches[1].clientX)*(e.touches[0].clientX-e.touches[1].clientX)+(e.touches[0].clientY-e.touches[1].clientY)*(e.touches[0].clientY-e.touches[1].clientY);0!=t&&o.setScale(o.prevScale*Math.pow(t/i,.5),{ex:(e.touches[0].clientX+e.touches[1].clientX)/2,ey:(e.touches[0].clientY+e.touches[1].clientY)/2})}}),this.dom.addEventListener("touchend",function(e){o.pinching.status=!1,o.prevScale=o.scale}),n.addEventListener("resize",function(e){viewBox="0 0 "+o.dom.scrollWidth*o.scale+" "+o.dom.scrollHeight*o.scale,o.dom.setAttribute("viewBox",viewBox),o.setPosition()}),viewBox="0 0 "+o.dom.scrollWidth*o.scale+" "+o.dom.scrollHeight*o.scale,o.dom.setAttribute("viewBox",viewBox)}function n(e,t,i){e.selectedNode&&(e.selectedNode._rect.style.fill=e.current.fill,e.selectedNode._rect.style.stroke=e.current.stroke),e.selectedNode=t,e.current.fill=t._rect.style.fill,e.current.stroke=t._rect.style.stroke,i||(i={}),i.fill?e.selectedNode._rect.style.fill=i.fill:e.selectedNode._rect.style.fill="#33DD33",i.stroke?e.selectedNode._rect.style.stroke=i.stroke:e.selectedNode._rect.style.stroke="#11BB11"}function o(e,t){if(t._line&&e.removeElement(t._line),t._direction&&e.removeElement(t._direction),t._rect&&e.removeElement(t._rect),t._text&&e.removeElement(t._text),t.parent)for(var i=t.parent.children,r=0;r<i.length;r++)if(i[r]==t)return i.splice(r,1),t;return null}function l(e,t,i,r,n,o,c){if(c||(c={}),i){var a=i.x,d=i.y;if(i.x=n*e.scale-t.dragging.anchorX,i.y=o*e.scale-t.dragging.anchorY,e.moveRectangle(i._rect,i.x,i.y),e.moveText(i._text,i.x,i.y),i._offset=s(i,r),i._direction&&e.moveCircle(i._direction,i.x+i._offset.x,i.y+i._offset.y),i.children)for(var h=0;h<i.children.length;h++)i.children[h]._direction&&(i.children[h]._offset=s(i.children[h],i),e.moveCircle(i.children[h]._direction,i.children[h].x+i.children[h]._offset.x,i.children[h].y+i.children[h]._offset.y));if("bezier"==c.lineType){i._line&&e.resetBezier(i._line,r.x+i._offset.parX,r.y+i._offset.parY,i.x+i._offset.x,i.y+i._offset.y);for(var h=0;h<i.children.length;h++)i.children[h]._line&&("descendents"==c.anchor?e.moveBezier(i.children[h]._line,i.x+i.children[h]._offset.parX,i.y+i.children[h]._offset.parY,i.children[h].x+i.children[h]._offset.x,i.children[h].y+i.children[h]._offset.y):e.resetBezier(i.children[h]._line,i.x+i.children[h]._offset.parX,i.y+i.children[h]._offset.parY,i.children[h].x+i.children[h]._offset.x,i.children[h].y+i.children[h]._offset.y))}else{i._line&&e.moveLine(i._line,r.x+i._offset.parX,r.y+i._offset.parY,i.x+i._offset.x,i.y+i._offset.y);for(var h=0;h<i.children.length;h++)i.children[h]._line&&e.moveLine(i.children[h]._line,i.x+i.children[h]._offset.parX,i.y+i.children[h]._offset.parY,i.children[h].x+i.children[h]._offset.x,i.children[h].y+i.children[h]._offset.y)}if("children"==c.anchor)for(var h=0;h<i.children.length;h++)l(e,t,i.children[h],i,(i.children[h].x+i.x-a+t.dragging.anchorX)/e.scale,(i.children[h].y+i.y-d+t.dragging.anchorY)/e.scale,{anchor:"none",lineType:c.lineType});else if("descendents"==c.anchor)for(var h=0;h<i.children.length;h++)l(e,t,i.children[h],i,(i.children[h].x+i.x-a+t.dragging.anchorX)/e.scale,(i.children[h].y+i.y-d+t.dragging.anchorY)/e.scale,{anchor:"descendents",lineType:c.lineType})}else t.dragging.dom&&(t.traverse(function(i,r,l,s){i.x+=n*e.scale-t.dragging.currX,i.y+=o*e.scale-t.dragging.currY,e.moveRectangle(i._rect,i.x,i.y),e.moveText(i._text,i.x,i.y),i._line&&("bezier"==c.lineType?e.moveBezier(i._line,s.x+i._offset.parX,s.y+i._offset.parY):e.moveLine(i._line,s.x+i._offset.parX,s.y+i._offset.parY)),i._direction&&e.moveCircle(i._direction,i.x+i._offset.x,i.y+i._offset.y)}),t.dragging.currX=n*e.scale,t.dragging.currY=o*e.scale)}function s(e,t,i){if(!t)return{x:0,y:0,parX:0,parY:0};i||(i={});var r={};return"vertical"==i.layout?e.y>t.y+t._rect.height.baseVal.value?(r.parY=t._rect.height.baseVal.value,r.y=0,r.parX=t._rect.width.baseVal.value/2,r.x=e._rect.width.baseVal.value/2):e.y+e._rect.height.baseVal.value<t.y?(r.parY=0,r.y=e._rect.height.baseVal.value,r.parX=t._rect.width.baseVal.value/2,r.x=e._rect.width.baseVal.value/2):e.x>t.x+t._rect.width.baseVal.value?(r.parY=t._rect.height.baseVal.value/2,r.y=e._rect.height.baseVal.value/2,r.parX=t._rect.width.baseVal.value,r.x=0):(r.parY=t._rect.height.baseVal.value/2,r.y=e._rect.height.baseVal.value/2,r.parX=0,r.x=e._rect.width.baseVal.value):e.x>t.x+t._rect.width.baseVal.value?(r.parX=t._rect.width.baseVal.value,r.x=0,r.parY=t._rect.height.baseVal.value/2,r.y=e._rect.height.baseVal.value/2):e.x+e._rect.width.baseVal.value<t.x?(r.parX=0,r.x=e._rect.width.baseVal.value,r.parY=t._rect.height.baseVal.value/2,r.y=e._rect.height.baseVal.value/2):e.y>t.y+t._rect.height.baseVal.value?(r.parX=t._rect.width.baseVal.value/2,r.x=e._rect.width.baseVal.value/2,r.parY=t._rect.height.baseVal.value,r.y=0):(r.parX=t._rect.width.baseVal.value/2,r.x=e._rect.width.baseVal.value/2,r.parY=0,r.y=e._rect.height.baseVal.value),r}var c=e("./Tree");r.prototype.setPosition=function(){this.x=this.dom.clientLeft,this.y=this.dom.clientTop;for(var e=this.dom.parentNode;null!=e;)e.offsetLeft?this.x+=e.offsetLeft:e.clientLeft&&(this.x+=e.clientLeft),e.offsetTop?this.y+=e.offsetTop:e.clientTop&&(this.y+=e.clientTop),e=e.parentElement;console.log(this)},r.prototype.setScale=function(e,t){var i=this.scale*this.dom.scrollWidth,r=this.scale*this.dom.scrollHeight;if(this.scale=e,this.scale<.1)this.scale=.1;else if(this.scale>10)this.scale=10;else{t||(t={});var n="";t.ex&&(this.coords.x-=(t.ex-this.x)/this.dom.scrollWidth*(this.dom.scrollWidth*e-i)),t.ey&&(this.coords.y-=(t.ey-this.y)/this.dom.scrollHeight*(this.dom.scrollHeight*e-r)),n+=this.coords.x+" "+this.coords.y+" "+this.dom.scrollWidth*this.scale+" "+this.dom.scrollHeight*this.scale,this.dom.setAttribute("viewBox",n)}},r.prototype.setAnchor=function(e){this.anchor=e},r.prototype.setSelectedAction=function(e){this.selectedAction=e},r.prototype.addBezier=function(e,t,i,r,n){var o=document.createElementNS("http://www.w3.org/2000/svg","path"),l=(e+i)/2,s=t,c=(e+i)/2,a=r;return o.setAttribute("d","M0 0 C"+(l-e)+" "+(s-t)+" "+(c-e)+" "+(a-t)+" "+(i-e)+" "+(r-t)),o.setAttribute("transform","translate("+e+","+t+")"),o.style.fill="none",n||(n={}),n.stroke?o.style.stroke=n.stroke:o.style.stroke="#000",n.strokeWidth?o.style.strokeWidth=n.strokeWidth:o.style.strokeWidth="2px",this.dom.insertBefore(o,this.dom.firstChild),o},r.prototype.resetBezier=function(e,t,i,r,n){var o=(t+r)/2,l=i,s=(t+r)/2,c=n;e.setAttribute("d","M0 0 C"+(o-t)+" "+(l-i)+" "+(s-t)+" "+(c-i)+" "+(r-t)+" "+(n-i)),e.setAttribute("transform","translate("+t+","+i+")")},r.prototype.moveBezier=function(e,t,i){e.setAttribute("transform","translate("+t+","+i+")")},r.prototype.addCircle=function(e,t,i,r){var n=document.createElementNS("http://www.w3.org/2000/svg","circle");return n.setAttribute("cx",e),n.setAttribute("cy",t),n.setAttribute("r",i),r||(r={}),r.fill?n.style.fill=r.fill:n.style.fill="#FFF",r.stroke?n.style.stroke=r.stroke:n.style.stroke="#000",r.strokeWidth?n.style.strokeWidth=r.strokeWidth:n.style.strokeWidth="2px",this.dom.appendChild(n),n},r.prototype.moveCircle=function(e,t,i){e.setAttribute("cx",t),e.setAttribute("cy",i)},r.prototype.addLine=function(e,t,i,r,n){var o=document.createElementNS("http://www.w3.org/2000/svg","line");return o.setAttribute("x1",e),o.setAttribute("y1",t),o.setAttribute("x2",i),o.setAttribute("y2",r),n.stroke?o.style.stroke=n.stroke:o.style.stroke="#000",n.strokeWidth?o.style.strokeWidth=n.strokeWidth:o.style.strokeWidth="2px",this.dom.appendChild(o),o},r.prototype.moveLine=function(e,t,i,r,n){if(r)e.setAttribute("x1",t),e.setAttribute("y1",i),e.setAttribute("x2",r),n&&e.setAttribute("y2",n);else{var o=t-parseFloat(e.getAttribute("x1")),l=i-parseFloat(e.getAttribute("y1"));e.setAttribute("x1",t),e.setAttribute("y1",i),e.setAttribute("x2",parseFloat(e.getAttribute("x2"))+o),e.setAttribute("y2",parseFloat(e.getAttribute("y2"))+l)}};var a=5;r.prototype.addRectangle=function(e,t,i,r,n,o,l){var s=document.createElementNS("http://www.w3.org/2000/svg","rect");if(n&&s.setAttribute("rx",n),o&&s.setAttribute("ry",o),l||(l={}),l.clickable&&(s.style.cursor="pointer"),l.fill?s.style.fill=l.fill:s.style.fill="#FFF",l.stroke?s.style.stroke=l.stroke:s.style.stroke="#000",l.strokeWidth?s.style.strokeWidth=l.strokeWidth:s.style.strokeWidth="1px",l.opacity&&s.setAttribute("fill-opacity",l.opacity),l.child){var c=l.child.getBBox();s.setAttribute("x",e),s.setAttribute("y",t),s.setAttribute("width",c.width+2*a),s.setAttribute("height",c.height+2*a),l.child.parentNode.insertBefore(s,l.child)}else s.setAttribute("x",e),s.setAttribute("y",t),s.setAttribute("width",i),s.setAttribute("height",r),this.dom.appendChild(s);return s},r.prototype.moveRectangle=function(e,t,i,r){r||(r={}),e.setAttribute("x",t),e.setAttribute("y",i)},r.prototype.addText=function(e,t,i,r){var n=document.createElementNS("http://www.w3.org/2000/svg","text");return n.innerHTML=i,n.setAttribute("alignment-baseline","central"),n.setAttribute("pointer-events","none"),n.setAttribute("x",e+a),r||(r={}),r.fill?n.setAttribute("fill",r.fill):n.setAttribute("fill","#000"),this.dom.appendChild(n),n.setAttribute("y",t+a+n.getBBox().height/2),n},r.prototype.moveText=function(e,t,i){e.setAttribute("x",t+a),e.setAttribute("y",i+a+e.getBBox().height/2)},r.prototype.clear=function(){c.maxIndex=0,this.dom.innerHTML=""},r.prototype.removeElement=function(e){this.dom.removeChild(e)},r.prototype.removeNode=function(e,t){if(void 0!==t&&!t){for(var i=[e];i.length>0;){for(var r=i.splice(0,1)[0],n=0;n<r.children.length;n++)i.push(r.children[n]);o(this,r)}return e}if(0==e.children.length)return o(this,e)},r.prototype.drawTree=function(e,t){var i=this;i.selectedNode=null,t||(t={}),i.current={},i.defaults={},t.fill?i.defaults.fill=t.fill:i.defaults.fill="#BBDDFF",t.stroke?i.defaults.stroke=t.stroke:i.defaults.stroke="#6688BB",t.rootFill?i.defaults.rootFill=t.rootFill:i.defaults.rootFill="#FF6666",t.rootStroke?i.defaults.rootStroke=t.rootStroke:i.defaults.rootStroke="#DD2222",t.lineStroke?i.defaults.lineStroke=t.lineStroke:i.defaults.lineStroke=i.defaults.stroke,t.cornerRadius?i.defaults.cornerRadius=t.cornerRadius:i.defaults.cornerRadius=2,i.clearable&&i.clear();var r=new c(e);r.traverse(function(e,t,r,n){e.contents&&(e._text=i.addText(0,0,e.contents));var o;o=n?i.addRectangle(0,0,5,5,i.defaults.cornerRadius,i.defaults.cornerRadius,{clickable:!0,fill:i.defaults.fill,stroke:i.defaults.stroke,child:e._text}):i.addRectangle(0,0,5,5,i.defaults.cornerRadius,i.defaults.cornerRadius,{clickable:!0,fill:i.defaults.rootFill,stroke:i.defaults.rootStroke,child:e._text}),e._rect=o}),r.initialize(),r.traverse(function(e,r,n,o){i.moveText(e._text,e.x,e.y),i.moveRectangle(e._rect,e.x,e.y);var l=s(e,o);e._offset=l,o&&("bezier"==t.lineType?e._line=i.addBezier(o.x+l.parX,o.y+l.parY,e.x+l.x,e.y+l.y,{stroke:i.defaults.lineStroke}):(t.lineType="line",e._line=i.addLine(o.x+l.parX,o.y+l.parY,e.x+l.x,e.y+l.y,{stroke:i.defaults.lineStroke})),e._direction=i.addCircle(e.x+l.x,e.y+l.y,2,{fill:i.defaults.lineStroke,stroke:i.defaults.lineStroke}))}),t.anchor||(t.anchor="none"),i.anchor=t.anchor,r.dragging={},r.traverse(function(e,o,l,s){e._rect.addEventListener("mousedown",function(o){n(i,e,{fill:t.selectedFill,stroke:t.selectedStroke}),r.dragging.node=e,r.dragging.parent=s,r.dragging.anchorX=o.clientX*i.scale-e.x,r.dragging.anchorY=o.clientY*i.scale-e.y,i.selectedAction&&i.selectedAction(i.selectedNode)}),e._rect.addEventListener("touchstart",function(o){1==o.touches.length&&(n(i,e,{fill:t.selectedFill,stroke:t.selectedStroke}),r.dragging.node=e,r.dragging.parent=s,r.dragging.anchorX=o.touches[0].clientX*i.scale-e.x,r.dragging.anchorY=o.touches[0].clientY*i.scale-e.y,i.selectedAction&&i.selectedAction(i.selectedNode))})}),i.dom.addEventListener("mousedown",function(e){e.target==i.dom&&(r.dragging.dom=!0,r.dragging.currX=e.clientX*i.scale,r.dragging.currY=e.clientY*i.scale)}),i.dom.addEventListener("touchstart",function(e){1==e.touches.length&&e.target==i.dom&&(r.dragging.dom=!0,r.dragging.currX=e.touches[0].clientX*i.scale,r.dragging.currY=e.touches[0].clientY*i.scale)}),i.dom.addEventListener("mousemove",function(e){l(i,r,r.dragging.node,r.dragging.parent,e.clientX,e.clientY,{lineType:t.lineType,anchor:i.anchor})}),i.dom.addEventListener("touchmove",function(e){1==e.touches.length&&l(i,r,r.dragging.node,r.dragging.parent,e.touches[0].clientX,e.touches[0].clientY,{lineType:t.lineType,anchor:i.anchor})}),i.dom.addEventListener("mouseup",function(e){r.dragging.node=void 0,r.dragging.dom=!1}),i.dom.addEventListener("touchend",function(e){r.dragging.node=void 0,r.dragging.dom=!1})},t.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Tree":2}],2:[function(e,t,i){"use strict";function r(e){this.root=e}function n(e,t,i,r,o){if(void 0!=e&&void 0!=t&&(void 0==i&&(i=0),void 0==r&&(r=0),t(e,i,r,o),e.children))for(var l=0;l<e.children.length;l++)n(e.children[l],t,i+1,l,e)}function o(e,t,i,r){if(void 0!=e&&void 0!=t){void 0==i&&(i=0),void 0==r&&(r=0);var n=[],o=[];for(n.push(e);n.length>0;){var l=n.splice(0,1)[0];if(r++,l.children)for(var s=0;s<l.children.length;s++){var c=l.children[s];c.parent=l,o.push(c)}t(l,i,r),0===n.length&&(n=o,o=[],i++,r=0)}}}function l(e){void 0===e?this.contents="":this.contents=e,this.children=[]}var s=10;r.prototype.initialize=function(){var e=this.root;r.maxIndex||(r.maxIndex=0);var t=r.maxIndex;null!=e&&(o(e,function(e,i,n){n+1>r.maxIndex&&(r.maxIndex=n+1),e.hasOwnProperty("x")||(e.x=165*i),e.hasOwnProperty("y")||(e.y=(n+t)*(e._rect.height.baseVal.value+s))}),r.maxIndex+=t)},r.prototype.traverse=function(e){n(this.root,e)},r.prototype.traverseBFS=function(e){o(this.root,e)},l.prototype.addChild=function(e){var t=new l(e);return this.children.push(t),t},l.prototype.removeChild=function(e){for(var t=0;t<this.children.length;t++)if(this.children[t]===e)return this.children.pop(e),e;return null},t.exports=r},{}],3:[function(e,t,i){"use strict";var r={SVG:e("./component/SVG")};window.trees=t.exports=r},{"./component/SVG":1}]},{},[3])(3)});