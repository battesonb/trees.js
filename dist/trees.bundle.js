!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.trees=e()}}(function(){return function e(t,i,r){function n(l,s){if(!i[l]){if(!t[l]){var a="function"==typeof require&&require;if(!s&&a)return a(l,!0);if(o)return o(l,!0);var c=new Error("Cannot find module '"+l+"'");throw c.code="MODULE_NOT_FOUND",c}var d=i[l]={exports:{}};t[l][0].call(d.exports,function(e){var i=t[l][1][e];return n(i?i:e)},d,d.exports,e,t,i,r)}return i[l].exports}for(var o="function"==typeof require&&require,l=0;l<r.length;l++)n(r[l]);return n}({1:[function(e,t,i){(function(i){function r(e,t){if(void 0===r)var r=i.document;if(void 0===o)var o=i;a.maxIndex=0;var s=this;this.dom=r.getElementById(e),t||(t={}),t.clear?this.clearable=t.clear:this.clearable=!1,t.height?this.dom.setAttribute("height",t.height):(this.height=Number(this.dom.getAttribute("height")),0==this.height&&this.dom.setAttribute("height",200)),this.setPosition(),t.width?this.dom.setAttribute("width",t.width):(this.width=Number(this.dom.getAttribute("width")),0==this.width&&this.dom.setAttribute("width",200)),t.scale?this.scale=t.scale:this.scale=1,this.coords={x:0,y:0},this.prevScale=this.scale,this.setScale(this.scale),this.pinching={status:!1,p1:{x:0,y:0},p2:{x:0,y:0}},this.trees=[],this.dragging={},this.dom.addEventListener("wheel",function(e){e.preventDefault();var t=e.deltaY>0?1:-1;s.setPosition(),s.setScale(s.scale+s.scale*t/10,{ex:e.clientX,ey:e.clientY})}),this.dom.addEventListener("touchstart",function(e){e.preventDefault(),e.target==s.dom&&(2==e.touches.length?(s.pinching.status=!0,s.pinching.p1.x=e.touches[0].clientX,s.pinching.p1.y=e.touches[0].clientY,s.pinching.p2.x=e.touches[1].clientX,s.pinching.p2.y=e.touches[1].clientY):1==e.touches.length&&(e.preventDefault(),s.inputdown=!0,s.dragging.dom=!0,s.dragging.currX=e.touches[0].clientX*s.scale,s.dragging.currY=e.touches[0].clientY*s.scale))}),this.dom.addEventListener("touchmove",function(e){if(e.preventDefault(),s.inputdown=!1,2==e.touches.length&&s.pinching.status){e.preventDefault();var i=(s.pinching.p1.x-s.pinching.p2.x)*(s.pinching.p1.x-s.pinching.p2.x)+(s.pinching.p1.y-s.pinching.p2.y)*(s.pinching.p1.y-s.pinching.p2.y),r=(e.touches[0].clientX-e.touches[1].clientX)*(e.touches[0].clientX-e.touches[1].clientX)+(e.touches[0].clientY-e.touches[1].clientY)*(e.touches[0].clientY-e.touches[1].clientY);0!=i&&s.setScale(s.prevScale*Math.pow(i/r,.5),{ex:(e.touches[0].clientX+e.touches[1].clientX)/2,ey:(e.touches[0].clientY+e.touches[1].clientY)/2})}else if(1==e.touches.length)if(s.dragging.dom)s.move(e.touches[0].clientX*s.scale-s.dragging.currX,e.touches[0].clientY*s.scale-s.dragging.currY),s.dragging.currX=e.touches[0].clientX*s.scale,s.dragging.currY=e.touches[0].clientY*s.scale;else if(s.dragging.node)for(var n=0;n<s.trees.length;n++)if(s.trees[n]===s.dragging.node._tree)return void l(s,s.dragging.node._tree,s.dragging.node,s.dragging.parent,e.touches[0].clientX,e.touches[0].clientY,{lineType:t.lineType,anchor:s.anchor})}),this.dom.addEventListener("touchend",function(e){e.preventDefault(),s.pinching.status=!1,s.prevScale=s.scale,s.dragging.node=void 0,s.dragging.dom=!1,s.inputdown&&e.target==s.dom&&(s.inputdown=void 0,n(s,null))}),this.dom.addEventListener("mousedown",function(e){e.target==s.dom&&(e.preventDefault(),s.inputdown=!0,s.dragging.dom=!0,s.dragging.currX=e.clientX*s.scale,s.dragging.currY=e.clientY*s.scale)}),this.dom.addEventListener("mousemove",function(e){if(e.preventDefault(),s.inputdown=void 0,s.dragging.dom)s.move(e.clientX*s.scale-s.dragging.currX,e.clientY*s.scale-s.dragging.currY),s.dragging.currX=e.clientX*s.scale,s.dragging.currY=e.clientY*s.scale;else if(s.dragging.node)for(var i=0;i<s.trees.length;i++)if(s.trees[i]===s.dragging.node._tree)return void l(s,s.dragging.node._tree,s.dragging.node,s.dragging.parent,e.clientX,e.clientY,{lineType:t.lineType,anchor:s.anchor})}),this.dom.addEventListener("mouseup",function(e){e.preventDefault(),s.inputdown&&e.target==s.dom&&(s.inputdown=void 0,n(s,null)),s.dragging.node=void 0,s.dragging.dom=!1}),o.addEventListener("resize",function(e){viewBox="0 0 "+s.getWidth()*s.scale+" "+s.getHeight()*s.scale,s.dom.setAttribute("viewBox",viewBox),s.setPosition()}),viewBox="0 0 "+this.getWidth()*s.scale+" "+this.getHeight()*s.scale,s.dom.setAttribute("viewBox",viewBox)}function n(e,t,i){e.selectedNode&&(e.selectedNode._rect.style.fill=e.current.fill,e.selectedNode._rect.style.stroke=e.current.stroke),e.selectedNode=t,null!=t&&void 0!=t&&(e.current.fill=t._rect.style.fill,e.current.stroke=t._rect.style.stroke,i||(i={}),i.fill?e.selectedNode._rect.style.fill=i.fill:e.selectedNode._rect.style.fill="#33DD33",i.stroke?e.selectedNode._rect.style.stroke=i.stroke:e.selectedNode._rect.style.stroke="#11BB11")}function o(e,t){if(t._line&&e.removeElement(t._line),t._direction&&e.removeElement(t._direction),t._rect&&e.removeElement(t._rect),t._text&&e.removeElement(t._text),t.parent)for(var i=t.parent.children,r=0;r<i.length;r++)if(i[r]==t)return i.splice(r,1),t;return null}function l(e,t,i,r,n,o,a){a||(a={});var c=i.x,d=i.y;if(i.x=n*e.scale-e.dragging.anchorX,i.y=o*e.scale-e.dragging.anchorY,e.moveRectangle(i._rect,i.x,i.y),e.moveText(i._text,i.x,i.y),i._offset=s(i,r),i._direction&&e.moveCircle(i._direction,i.x+i._offset.x,i.y+i._offset.y),i.children)for(var h=0;h<i.children.length;h++)i.children[h]._direction&&(i.children[h]._offset=s(i.children[h],i),e.moveCircle(i.children[h]._direction,i.children[h].x+i.children[h]._offset.x,i.children[h].y+i.children[h]._offset.y));if("bezier"==t.lineType)for(i._line&&e.resetBezier(i._line,r.x+i._offset.parX,r.y+i._offset.parY,i.x+i._offset.x,i.y+i._offset.y),h=0;h<i.children.length;h++)i.children[h]._line&&("descendents"==a.anchor?e.moveBezier(i.children[h]._line,i.x+i.children[h]._offset.parX,i.y+i.children[h]._offset.parY,i.children[h].x+i.children[h]._offset.x,i.children[h].y+i.children[h]._offset.y):e.resetBezier(i.children[h]._line,i.x+i.children[h]._offset.parX,i.y+i.children[h]._offset.parY,i.children[h].x+i.children[h]._offset.x,i.children[h].y+i.children[h]._offset.y));else for(i._line&&e.moveLine(i._line,r.x+i._offset.parX,r.y+i._offset.parY,i.x+i._offset.x,i.y+i._offset.y),h=0;h<i.children.length;h++)i.children[h]._line&&e.moveLine(i.children[h]._line,i.x+i.children[h]._offset.parX,i.y+i.children[h]._offset.parY,i.children[h].x+i.children[h]._offset.x,i.children[h].y+i.children[h]._offset.y);if("children"==a.anchor)for(h=0;h<i.children.length;h++)l(e,t,i.children[h],i,(i.children[h].x+i.x-c+e.dragging.anchorX)/e.scale,(i.children[h].y+i.y-d+e.dragging.anchorY)/e.scale,{anchor:"none",lineType:a.lineType});else if("descendents"==a.anchor)for(h=0;h<i.children.length;h++)l(e,t,i.children[h],i,(i.children[h].x+i.x-c+e.dragging.anchorX)/e.scale,(i.children[h].y+i.y-d+e.dragging.anchorY)/e.scale,{anchor:"descendents",lineType:a.lineType})}function s(e,t,i){if(!t)return{x:0,y:0,parX:0,parY:0};i||(i={});var r={};return"vertical"==i.layout?e.y>t.y+t._rect.height.baseVal.value?(r.parY=t._rect.height.baseVal.value,r.y=0,r.parX=t._rect.width.baseVal.value/2,r.x=e._rect.width.baseVal.value/2):e.y+e._rect.height.baseVal.value<t.y?(r.parY=0,r.y=e._rect.height.baseVal.value,r.parX=t._rect.width.baseVal.value/2,r.x=e._rect.width.baseVal.value/2):e.x>t.x+t._rect.width.baseVal.value?(r.parY=t._rect.height.baseVal.value/2,r.y=e._rect.height.baseVal.value/2,r.parX=t._rect.width.baseVal.value,r.x=0):(r.parY=t._rect.height.baseVal.value/2,r.y=e._rect.height.baseVal.value/2,r.parX=0,r.x=e._rect.width.baseVal.value):e.x>t.x+t._rect.width.baseVal.value?(r.parX=t._rect.width.baseVal.value,r.x=0,r.parY=t._rect.height.baseVal.value/2,r.y=e._rect.height.baseVal.value/2):e.x+e._rect.width.baseVal.value<t.x?(r.parX=0,r.x=e._rect.width.baseVal.value,r.parY=t._rect.height.baseVal.value/2,r.y=e._rect.height.baseVal.value/2):e.y>t.y+t._rect.height.baseVal.value?(r.parX=t._rect.width.baseVal.value/2,r.x=e._rect.width.baseVal.value/2,r.parY=t._rect.height.baseVal.value,r.y=0):(r.parX=t._rect.width.baseVal.value/2,r.x=e._rect.width.baseVal.value/2,r.parY=0,r.y=e._rect.height.baseVal.value),r}var a=e("./Tree");r.prototype.setPosition=function(){var e=this.dom.getBoundingClientRect();this.x=e.left,this.y=e.top},r.prototype.setColor=function(e,t){t||(t={}),e._tree.root===e?(t.fill||(t.fill=e._tree.defaults.rootFill),t.stroke||(t.stroke=e._tree.defaults.rootStroke)):(t.fill||(t.fill=e._tree.defaults.fill),t.stroke||(t.stroke=e._tree.defaults.stroke)),e._rect.style.stroke=t.stroke,e._rect.style.fill=t.fill},r.prototype.setScale=function(e,t){var i=this.getWidth(),r=this.getHeight(),n=this.scale*i,o=this.scale*r;this.scale=e,this.scale<.1?this.scale=.1:this.scale>10?this.scale=10:(t||(t={}),t.ex&&(this.coords.x-=(t.ex-this.x)/i*(i*e-n)),t.ey&&(this.coords.y-=(t.ey-this.y)/r*(r*e-o)),viewBox=this.coords.x+" "+this.coords.y+" "+i*this.scale+" "+r*this.scale,this.dom.setAttribute("viewBox",viewBox))},r.prototype.move=function(e,t){this.coords.x-=e,this.coords.y-=t,viewBox=this.coords.x+" "+this.coords.y+" "+this.getWidth()*this.scale+" "+this.getHeight()*this.scale,this.dom.setAttribute("viewBox",viewBox)},r.prototype.getWidth=function(){if(this.dom.scrollWidth>0)return this.dom.scrollWidth;var e=this.dom.width.baseVal.unitType;return 2==e?this.dom.parentNode.scrollWidth*this.dom.width.baseVal.value:this.dom.width.baseVal.value},r.prototype.getHeight=function(){if(this.dom.scrollHeight>0)return this.dom.scrollHeight;var e=this.dom.height.baseVal.unitType;return 2==e?this.dom.parentNode.scrollHeight*this.dom.height.baseVal.value:this.dom.height.baseVal.value},r.prototype.setAnchor=function(e){this.anchor=e},r.prototype.setSelectedAction=function(e){this.selectedAction=e},r.prototype.addBezier=function(e,t,i,r,n){var o=document.createElementNS("http://www.w3.org/2000/svg","path"),l=(e+i)/2,s=t,a=(e+i)/2,c=r;return o.setAttribute("d","M0 0 C"+(l-e)+" "+(s-t)+" "+(a-e)+" "+(c-t)+" "+(i-e)+" "+(r-t)),o.setAttribute("transform","translate("+e+","+t+")"),o.style.fill="none",n||(n={}),n.stroke?o.style.stroke=n.stroke:o.style.stroke="#000",n.strokeWidth?o.style.strokeWidth=n.strokeWidth:o.style.strokeWidth="2px",this.dom.insertBefore(o,this.dom.firstChild),o},r.prototype.resetBezier=function(e,t,i,r,n){var o=(t+r)/2,l=i,s=(t+r)/2,a=n;e.setAttribute("d","M0 0 C"+(o-t)+" "+(l-i)+" "+(s-t)+" "+(a-i)+" "+(r-t)+" "+(n-i)),e.setAttribute("transform","translate("+t+","+i+")")},r.prototype.moveBezier=function(e,t,i){e.setAttribute("transform","translate("+t+","+i+")")},r.prototype.addCircle=function(e,t,i,r){var n=document.createElementNS("http://www.w3.org/2000/svg","circle");return n.setAttribute("cx",e),n.setAttribute("cy",t),n.setAttribute("r",i),r||(r={}),r.fill?n.style.fill=r.fill:n.style.fill="#FFF",r.stroke?n.style.stroke=r.stroke:n.style.stroke="#000",r.strokeWidth?n.style.strokeWidth=r.strokeWidth:n.style.strokeWidth="2px",this.dom.appendChild(n),n},r.prototype.moveCircle=function(e,t,i){e.setAttribute("cx",t),e.setAttribute("cy",i)},r.prototype.addLine=function(e,t,i,r,n){var o=document.createElementNS("http://www.w3.org/2000/svg","line");return o.setAttribute("x1",e),o.setAttribute("y1",t),o.setAttribute("x2",i),o.setAttribute("y2",r),n.stroke?o.style.stroke=n.stroke:o.style.stroke="#000",n.strokeWidth?o.style.strokeWidth=n.strokeWidth:o.style.strokeWidth="2px",this.dom.appendChild(o),o},r.prototype.moveLine=function(e,t,i,r,n){if(r)e.setAttribute("x1",t),e.setAttribute("y1",i),e.setAttribute("x2",r),n&&e.setAttribute("y2",n);else{var o=t-parseFloat(e.getAttribute("x1")),l=i-parseFloat(e.getAttribute("y1"));e.setAttribute("x1",t),e.setAttribute("y1",i),e.setAttribute("x2",parseFloat(e.getAttribute("x2"))+o),e.setAttribute("y2",parseFloat(e.getAttribute("y2"))+l)}};var c=5;r.prototype.addRectangle=function(e,t,i,r,n,o,l){var s=document.createElementNS("http://www.w3.org/2000/svg","rect");if(n&&s.setAttribute("rx",n),o&&s.setAttribute("ry",o),l||(l={}),l.clickable&&(s.style.cursor="pointer"),l.fill?s.style.fill=l.fill:s.style.fill="#FFF",l.stroke?s.style.stroke=l.stroke:s.style.stroke="#000",l.strokeWidth?s.style.strokeWidth=l.strokeWidth:s.style.strokeWidth="1px",l.opacity&&s.setAttribute("fill-opacity",l.opacity),l.child){var a=l.child.getBBox();s.setAttribute("x",e),s.setAttribute("y",t),s.setAttribute("width",a.width+2*c),s.setAttribute("height",a.height+2*c),l.child.parentNode.insertBefore(s,l.child)}else s.setAttribute("x",e),s.setAttribute("y",t),s.setAttribute("width",i),s.setAttribute("height",r),this.dom.appendChild(s);return s},r.prototype.moveRectangle=function(e,t,i,r){r||(r={}),e.setAttribute("x",t),e.setAttribute("y",i)},r.prototype.addText=function(e,t,i,r){var n=document.createElementNS("http://www.w3.org/2000/svg","text");return n.innerHTML=i,n.setAttribute("alignment-baseline","central"),n.setAttribute("pointer-events","none"),n.setAttribute("x",e+c),r||(r={}),r.fill?n.setAttribute("fill",r.fill):n.setAttribute("fill","#000"),this.dom.appendChild(n),n.setAttribute("y",t+c+this.dom.lastChild.getBBox().height/2),n},r.prototype.moveText=function(e,t,i){e.setAttribute("x",t+c),e.setAttribute("y",i+c+e.getBBox().height/2)},r.prototype.clear=function(){a.maxIndex=0,this.dom.innerHTML=""},r.prototype.removeElement=function(e){this.dom.removeChild(e)},r.prototype.removeNode=function(e,t){if(void 0!==t&&!t){for(var i=[e];i.length>0;){for(var r=i.splice(0,1)[0],n=0;n<r.children.length;n++)i.push(r.children[n]);o(this,r)}return e}if(0==e.children.length)return o(this,e)},r.prototype.drawTree=function(e,t){var i=this;i.selectedNode=null,t||(t={}),i.current={};var r=new a(e);r.defaults={},t.fill?r.defaults.fill=t.fill:r.defaults.fill="#BBDDFF",t.stroke?r.defaults.stroke=t.stroke:r.defaults.stroke="#6688BB",t.rootFill?r.defaults.rootFill=t.rootFill:r.defaults.rootFill="#FF6666",t.rootStroke?r.defaults.rootStroke=t.rootStroke:r.defaults.rootStroke="#DD2222",t.lineStroke?r.defaults.lineStroke=t.lineStroke:r.defaults.lineStroke=r.defaults.stroke,t.lineType||(t.lineType="line"),t.cornerRadius?r.defaults.cornerRadius=t.cornerRadius:r.defaults.cornerRadius=2,i.clearable&&i.clear(),r.lineType=t.lineType,r.traverse(function(e,t,n,o){e._tree=r,e.contents&&(e._text=i.addText(0,0,e.contents));var l;l=o?i.addRectangle(0,0,5,5,r.defaults.cornerRadius,r.defaults.cornerRadius,{clickable:!0,fill:r.defaults.fill,stroke:r.defaults.stroke,child:e._text}):i.addRectangle(0,0,5,5,r.defaults.cornerRadius,r.defaults.cornerRadius,{clickable:!0,fill:r.defaults.rootFill,stroke:r.defaults.rootStroke,child:e._text}),e._rect=l}),r.initialize(),r.traverse(function(e,n,o,l){i.moveText(e._text,e.x,e.y),i.moveRectangle(e._rect,e.x,e.y);var a=s(e,l);e._offset=a,l&&("bezier"==t.lineType?e._line=i.addBezier(l.x+a.parX,l.y+a.parY,e.x+a.x,e.y+a.y,{stroke:r.defaults.lineStroke}):(t.lineType="line",e._line=i.addLine(l.x+a.parX,l.y+a.parY,e.x+a.x,e.y+a.y,{stroke:r.defaults.lineStroke})),e._direction=i.addCircle(e.x+a.x,e.y+a.y,2,{fill:r.defaults.lineStroke,stroke:r.defaults.lineStroke}))}),t.anchor||(t.anchor="none"),i.anchor=t.anchor,r.traverse(function(e,r,o,l){e._rect.addEventListener("mousedown",function(r){i.selectedAction&&i.selectedAction(e),n(i,e,{fill:t.selectedFill,stroke:t.selectedStroke}),i.dragging.node=e,i.dragging.parent=l,i.dragging.anchorX=r.clientX*i.scale-e.x,i.dragging.anchorY=r.clientY*i.scale-e.y}),e._rect.addEventListener("touchstart",function(r){1==r.touches.length&&(i.selectedAction&&i.selectedAction(e),n(i,e,{fill:t.selectedFill,stroke:t.selectedStroke}),i.dragging.node=e,i.dragging.parent=l,i.dragging.anchorX=r.touches[0].clientX*i.scale-e.x,i.dragging.anchorY=r.touches[0].clientY*i.scale-e.y)})}),i.trees.push(r)},t.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Tree":2}],2:[function(e,t,i){"use strict";function r(e){this.root=e}function n(e,t,i,r,o){if(void 0!=e&&void 0!=t&&(void 0==i&&(i=0),void 0==r&&(r=0),t(e,i,r,o),e.children))for(var l=0;l<e.children.length;l++)n(e.children[l],t,i+1,l,e)}function o(e,t,i,r){if(void 0!=e&&void 0!=t){void 0==i&&(i=0),void 0==r&&(r=0);var n=[],o=[];for(n.push(e);n.length>0;){var l=n.splice(0,1)[0];if(r++,l.children)for(var s=0;s<l.children.length;s++){var a=l.children[s];a.parent=l,o.push(a)}t(l,i,r),0===n.length&&(n=o,o=[],i++,r=0)}}}function l(e){void 0===e?this.contents="":this.contents=e,this.children=[]}var s=10;r.prototype.initialize=function(){var e=this.root;r.maxIndex||(r.maxIndex=0);var t=r.maxIndex;null!=e&&(o(e,function(e,i,n){n+1>r.maxIndex&&(r.maxIndex=n+1),e.hasOwnProperty("x")||(e.x=165*i),e.hasOwnProperty("y")||(e.y=(n+t)*(e._rect.height.baseVal.value+s))}),r.maxIndex+=t)},r.prototype.traverse=function(e){n(this.root,e)},r.prototype.traverseBFS=function(e){o(this.root,e)},l.prototype.addChild=function(e){var t=new l(e);return this.children.push(t),t},l.prototype.removeChild=function(e){for(var t=0;t<this.children.length;t++)if(this.children[t]===e)return this.children.pop(e),e;return null},t.exports=r},{}],3:[function(e,t,i){"use strict";var r={SVG:e("./component/SVG")};window.trees=t.exports=r},{"./component/SVG":1}]},{},[3])(3)});