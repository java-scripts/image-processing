(function(){	
	var hsvToRgb=function(h, s, v) {			
			h=h/255; s=s/255; v=v/255;
			var r, g, b;
			var i = Math.floor(h * 6);
			var f = h * 6 - i;
			var p = v * (1 - s);
			var q = v * (1 - f * s);
			var t = v * (1 - (1 - f) * s);
			switch (i % 6) {
			  case 0:r = v, g = t, b = p;break;
			  case 1:r = q, g = v, b = p;break;
			  case 2:r = p, g = v, b = t;break;
			  case 3:r = p, g = q, b = v;break;
			  case 4:r = t, g = p, b = v;break;
			  case 5:r = v, g = p, b = q;break;
			}
			return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
		  };
	var rgbToHsv=function(r, g, b) {
			r = r / 255, g = g / 255, b = b / 255;
			var max = Math.max(r, g, b),
			min = Math.min(r, g, b);
			var h, s, v = max;
			var d = max - min;
			s = max == 0 ? 0 : d / max;
			if (max == min) {
			  h = 0; // achromatic
			} else {
			  switch (max) {
				case r:  h = (g - b) / d + (g < b ? 6 : 0);		  break;
				case g:	  h = (b - r) / d + 2;  break;
				case b:  h = (r - g) / d + 4;  break;
			  }
			  h /= 6;
			}
			return [Math.round(h*255),Math.round(s*255), Math.round(v*255)];
		  };
	
	/*
	* returns arithmetic mean. 
	* since ecluding the alpha values, data lengh would be data.length*3/4	
	*/
	var getMean = function(data){
		var sum=0;
		for(var i=0;i<data.length;i+=4){
			sum+=data[i]+data[i+1]+data[i+2];			
		}
		return 4*sum/(3*data.length);
	};
	

	var getk=function(x,y,width){
		return 4*(y*width+x);
	}
	
	var walk=function(options){
		var settings=$.extend({lengh:0,speed:1000,step:function(x){},oncomplete:function(){}},options);	
		var i=0;var time = 1000/settings.speed;
		function step(){			
			//process
			settings.step(i);
			i++;			
			if(i<settings.lengh){				
				window.setTimeout(function(){
					step();
				},time);
			}else{
				settings.oncomplete();
			}	
		}
		step();
	}
	
	impro={		
		copyImageData:function(settings){
			var dst = settings.ctx.createImageData(settings.src.width, settings.src.height);
			dst.data.set(settings.src.data);
			return dst;
		},
		invert:function(settings){				
			var s = settings.src.data;
			var d = settings.dst.data;			
			for(var i=0;i<s.length;i+=4){		
				d[i]=255-s[i];d[i+1]=255-s[i+1];d[i+2]=255-s[i+2];		
			}	
		},
		setRGBA:function(settings){	
			var s = settings.src.data;
			var d = settings.dst.data;	
			var r = settings.r;
			var g = settings.g;
			var b = settings.b;
			var a = settings.a;			
			for(var i=0;i<s.length;i+=4){		
				d[i]=s[i]+r;	
				d[i+1]=s[i+1]+g;		
				d[i+2]=s[i+2]+b;	
				d[i+3]=a;			
			}	
		},		
		setBrContrast:function(settings){
			var s = settings.src.data;
			var d = settings.dst.data;	
			var b = settings.brightness;
			var c = settings.contrast;
			var m = getMean(s);				
			for(var i=0;i<s.length;i+=4){		
				d[i]=m+(s[i]-m)*c+b;
				d[i+1]=m+(s[i+1]-m)*c+b;
				d[i+2]=m+(s[i+2]-m)*c+b;			
			}	
		},
		setHSV:function(settings){
			var src = settings.src.data;
			var d = settings.dst.data;	
			var h = settings.h;
			var s = settings.s;
			var v = settings.v;					
			for(var i=0;i<src.length;i+=4){					
				hsb=rgbToHsv(src[i],src[i+1],src[i+2]);											
				rgb=hsvToRgb((hsb[0]+h+255)%255,hsb[1]*s,hsb[2]*v);			
				d[i]=rgb[0];	
				d[i+1]=rgb[1];
				d[i+2]=rgb[2];
				d[i+3]=255;			
			}		
		},
		sketch:function(settings){
			var s = settings.src.data;
			var d = settings.dst.data;						
			for(var i=0;i<s.length;i+=4){
				hsb=rgbToHsv(s[i],s[i+1],s[i+2]);
				rgb=hsvToRgb(step(hsb[0]),step(hsb[1]),step(hsb[2]));		
				d[i]=rgb[0];	
				d[i+1]=rgb[1];
				d[i+2]=rgb[2];	
							
			}
			function step(v){return Math.min(255,Math.round(v/100)*100)}
		},
		applyFilter:function(settings){			
			var imageData = settings.src;
			var s = settings.src.data;
			var d = settings.dst.data;
			var f = settings.f;		
			var w = imageData.width;			
			var progressStep = Math.round(w/10)-1;
			walk({
				lengh:w,
				speed:10000,
				step:function(x){			
					for(y=0;y<settings.src.height;y++){
						i = getk(x,y,w);
						filterOnpixel(x,y);	
					}
					ctx.putImageData(dst,0,0);
					if(x%progressStep==0){
						progress.width(x*100/w+'%');					
					}	
				},
				oncomplete:function(){
					ctx.putImageData(dst,0,0);
					progress.width('100%');						
				}	
			})			
			function filterOnpixel(x,y){
				k = getk(x,y,w);				
					dr=0;dg=0;db=0;
					xcenter=(f.length-1)/2;
					ycenter=(f[0].length-1)/2;
					for(var i=0;i<f.length;i++){
						for(var j=0;j<f[0].length;j++){							
							dr+=(f[i][j]*s[getk(x-xcenter+i,y-ycenter+j,w)]);
							dg+=(f[i][j]*s[getk(x-xcenter+i,y-ycenter+j,w)+1]);
							db+=(f[i][j]*s[getk(x-xcenter+i,y-ycenter+j,w)+2]);
						}				
					}				
					d[k]=dr;
					d[k+1]=dg;
					d[k+2]=db;	
			}
		},
		specialFilter:function(settings){			
			var imageData = settings.src;
			var s = settings.src.data;
			var d = settings.dst.data;
			var f = settings.f;		
			var w = imageData.width;
			var invert = settings.invert;
			var channel = settings.channel||0;
			for (x=0;x<imageData.width; x++) {
				for(y=0;y<imageData.height;y++){					
					k = getk(x,y,w);					
					d[k]=0;	d[k+1]=0;d[k+2]=0;					
					dr=0;
					xcenter=(f.length-1)/2;
					ycenter=(f[0].length-1)/2;
					for(var i=0;i<f.length;i++){
						for(var j=0;j<f[0].length;j++){	
							sv=s[getk(x-xcenter+i,y-ycenter+j,w)+channel];
							if(sv)dr+=(f[i][j]*sv);							
						}				
					}				
					dr=invert?255-dr:dr;
					//d[k+channel]=dr;					
					d[k]=dr;d[k+1]=dr;d[k+2]=dr;				
				}
			}		
		},
		Filters:{
			EdgeDetect:{
				laplace1:[[0,-1,0],[-1,4,-1],[0,-1,0]],
				laplace2:[[-1,-1,-1],[-1,8,-1],[-1,-1,-1]],
				gaussian:[
							[0,1,1,2,2,2,1,1,0],
							[1,2,4,5,5,5,4,2,1],
							[1,4,5,3,0,3,5,4,1],
							[2,5,3,-12,-24,-12,3,5,2],
							[2,5,0,-24,-40,-24,0,5,2],
							[2,5,3,-12,-24,-12,3,5,2],
							[1,4,5,3,0,3,5,4,1],
							[1,2,4,5,5,5,4,2,1],
							[0,1,1,2,2,2,1,1,0]
							],
			},
			Sharp:{
				laplace1:[[0,-1,0],[-1,5,-1],[0,-1,0]],
				laplace2:[[-1,-1,-1],[-1,9,-1],[-1,-1,-1]],
			},
			getAvgBlurFilter:function(r){							
				var f=[];
				for(var i=0;i<r;i++){
					f[i]=[];
					for(var j=0;j<r;j++){
						f[i][j]=1/r/r;
					}
				}
				return f;
			}	
		}		 
	};//impro
}());

	





