(function($){
	/*custom jquery extension to select image from file system */
	$.fn.imgSelect = function(fn){	
		var that = this;
		return this.change(function(evt) {
		  var tgt = evt.target || window.event.srcElement,
			files = tgt.files;			
		  // FileReader support
		  if (FileReader && files && files.length) {
			var fr = new FileReader();
			fr.onload = function() {
			  var img = new Image();
			  img.src = fr.result;	
			  img.onload = function() {
			     if(fn)fn.call(that,img,files[0],evt);
			  };
			};
			fr.readAsDataURL(files[0]);
		  }
		});	
	}
	
	/*custom jquery reset method;*/
	$.fn.reset = function(){
		if(this[0]){
			this[0].reset();
		}
		return this;
	}
	
}(jQuery));

(function(){	
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');	
	$('#fileInput').imgSelect(function(img,file){		
		init(img,file);
	});
	$('form').submit(function(e){
		e.preventDefault();
	});	
	function init(img,file){	
		canvas.height=img.height*canvas.width/img.width;	
		ctx.drawImage(img,0,0, canvas.width,canvas.height);
		src = ctx.getImageData(0,0, canvas.width,canvas.height);
		dst = impro.copyImageData({ctx:ctx,src:src});		
		ctx.putImageData(dst,0,0);
		progress = $('.progress-bar');
		fileName = file.name;
	}
	
}());

function saveChanges(el){
	src = impro.copyImageData({ctx:ctx,src:dst});
	$(el).closest('form').reset();
	$(el).closest('.controls').hide();
}

function cancelChanges(el){
	$(el).closest('form').reset();
	dst = impro.copyImageData({ctx:ctx,src:src});	
	ctx.putImageData(dst,0,0);	
}


function invert(){
	impro.invert({src:src,dst:dst});
	ctx.putImageData(dst,0,0);	
}
function setRGBA(){
	impro.setRGBA({
		src:src,
		dst:dst,
		r:$('#r').val()*1,
		g:$('#g').val()*1,
		b:$('#b').val()*1,
		a:$('#a').val()*1,
	});		
	ctx.putImageData(dst,0,0);	
}

function setHSV(){
	impro.setHSV({
		src:src,
		dst:dst,
		h:$('#h').val()*1,
		s:$('#s').val()*1,
		v:$('#v').val()*1,	
	});
	ctx.putImageData(dst,0,0);
}

function setBrContrast(){
	impro.setBrContrast({
		src:src,
		dst:dst,
		brightness:$('#brightness').val()*1,
		contrast:$('#contrast').val()*1,			
	});		
	ctx.putImageData(dst,0,0);
}



function blackBoard(){
	impro.applyFilter({
		src:src,
		dst:dst,		
		f:impro.Filters.EdgeDetect.laplace1,
		oncomplete:function(src){
			src = impro.setHSV({src:src,dst:dst,h:0,s:0,v:2});			
			ctx.putImageData(dst,0,0);	
		}
	});
}
function pencil(){
	impro.applyFilter({
		src:src,
		dst:dst,		
		f:impro.Filters.EdgeDetect.laplace1,
		oncomplete:function(src){
			src = impro.setHSV({src:src,dst:dst,h:0,s:0,v:2});
			dst = impro.invert({src:src,dst:dst});
			ctx.putImageData(dst,0,0);	
		}
	});	
}
function avgBlur(){		
	impro.applyFilter({
		src:src,
		dst:dst,
		f:impro.Filters.getAvgBlurFilter(5),
		showProgress:true,
		oncomplete:function(dst){
			ctx.putImageData(dst,0,0);
		}
	});
}

function sharp(){
	impro.applyFilter({
		src:src,
		dst:dst,	
		f:impro.Filters.Sharp.laplace1,
		showProgress:true,
		oncomplete:function(dst){
			ctx.putImageData(dst,0,0);
		}
	});	
}
function colorSketchApply(){
	impro.colorLevel({
		src:src,
		dst:dst,		
		n:$('#colorLevels').val()*1,
		});
	ctx.putImageData(dst,0,0);
}

function greySketchApply(){
	impro.greyLevel({
		src:src,
		dst:dst,			
		n:$('#greyLevels').val()*1,
		});
	ctx.putImageData(dst,0,0);
}

function hardSheet(){
	impro.applyFilter({
		src:src,
		dst:dst,	
		f:[[-3,-1,0],[-1,1,1],[0,1,3]],
		showProgress:true,
		oncomplete:function(dst){
			ctx.putImageData(dst,0,0);
		}
	});
}

function colorGlow(){
	impro.applyFilter({
		src:src,
		dst:dst,	
		f:[[-1,-1,-1],[-1,8,-1],[-1,-1,-1]],
		showProgress:true,
		oncomplete:function(dst){
			ctx.putImageData(dst,0,0);
		}
	});	
}

function customFilterApply(el){		
		var cf=[[],[],[]];
		$('.cftext').each(function(i){			
			cf[Math.floor(i/3)].push($(this).val()*1)
		});
		impro.applyFilter({
			src:src,
			dst:dst,	
			f:cf,
			showProgress:true,
			oncomplete:function(dst){
				ctx.putImageData(dst,0,0);
			}
		});
		
}
function customFilterReset(el){		
		$(el).closest('form').reset();
		dst = impro.copyImageData({ctx:ctx,src:src});	
		ctx.putImageData(dst,0,0);	
}

function customFunctionApply(el){	
	fn=$('#customFn').val();	
	eval("fn="+fn);
	console.log(fn)
	impro.customFunction({
		src:src,
		dst:dst,	
		fn:fn,
	});
	ctx.putImageData(dst,0,0);
}

function customFunctionReset(el){		
		$(el).closest('form').reset();
		dst = impro.copyImageData({ctx:ctx,src:src});	
		ctx.putImageData(dst,0,0);	
}
