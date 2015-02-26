(function(){
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	$('#fileInput').imgSelect(function(img){
		init(img);
	});
	//img = new Image();
	//img.src = 'Penguins.jpg';
	//img.onload = function(){
	//	init(img);
	//}
	
	function init(img){	
		canvas.height=img.height*canvas.width/img.width;	
		ctx.drawImage(img,0,0, canvas.width,canvas.height);
		src = ctx.getImageData(0,0, canvas.width,canvas.height);
		dst = impro.copyImageData({ctx:ctx,src:src});		
		ctx.putImageData(dst,0,0);	
	}
	
}());


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

function saveChanges(el){
	src = impro.copyImageData({ctx:ctx,src:dst});
	$(el).closest('form')[0].reset();
	$(el).closest('.controls').hide();
}

function cancelChanges(el){
	$(el).closest('form')[0].reset();
	ctx.putImageData(src,0,0);	
}



function edgeDetect(){
	impro.applyFilterChannel({
		src:src,
		dst:dst,
		channel:0,
		invert:true,
		f:impro.Filters.EdgeDetect.laplace1,
		});
	ctx.putImageData(dst,0,0);	

}

function avgBlur(){		
	impro.applyFilter({
		src:src,
		dst:dst,
		f:impro.Filters.getAvgBlurFilter(5),
		});
	ctx.putImageData(dst,0,0);

}

function sharp(){
	impro.applyFilter({
		src:src,
		dst:dst,	
		f:impro.Filters.Sharp.laplace1,
		});
	ctx.putImageData(dst,0,0);
}
function sketch(){
	impro.sketch({
		src:src,
		dst:dst,	
		f:impro.Filters.Sharp.laplace1,
		});
	ctx.putImageData(dst,0,0);
}