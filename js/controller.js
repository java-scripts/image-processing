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
		progress = $('#progress');
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

function customFilter(n){
	console.log(n)
	var t = $('#custom-data-form .data');
	var a = $('#custom-data-form .action');
	var html='';
	 defaultf=[[1,1,1],[1,-8,1],[1,1,1]];
	 cf=[];
	for(var i=0;i<n;i++){				
		for(var j=0;j<n;j++){
			html+='<input type="text" class="col-md-4 cftext" value="'+defaultf[i][j]+'" style="padding: 1px;">';		
		}
	}
	t.html(html);	
	html='<button class="btn btn-primary action-btn" >Apply</button> ';
	html+='<button class="btn btn-primary reset-btn" >Reset</button>';
	a.html(html);	
	$('.action-btn').click(function(){
		cf=[[],[],[]];
		$('.cftext').each(function(i){			
			cf[Math.floor(i/3)].push($(this).val()*1)
		});
		impro.applyFilter({
			src:src,
			dst:dst,	
			f:cf,
			});
		ctx.putImageData(dst,0,0);
	});
	
	$('.reset-btn').click(function(e){
		$(this).closest('form').reset();
		dst = impro.copyImageData({ctx:ctx,src:src});	
		ctx.putImageData(dst,0,0);	
	});
}


