export default abstract class ImgUtils {
	static _canvas = document.createElement("canvas");
	static _ctx = ImgUtils._canvas.getContext("2d")!
	static _img = document.createElement("img");

	static scaleTo<T extends {width:number, height:number}>(img:T) {
		ImgUtils._canvas.width = img.width;
		ImgUtils._canvas.height = img.height;
	}

	static loadImageDataFromSrc(
		src:string, 
		width?:number, 
		height?:number
	):Promise<ImageData> {
		return new Promise((res, rej) => {
			ImgUtils._img.onerror = rej;
			ImgUtils._img.onload = () => {
				const dims = {
					width: width || ImgUtils._img.width,
					height: height || ImgUtils._img.height,
				}
				ImgUtils.scaleTo(dims);
	
				ImgUtils._ctx.drawImage(ImgUtils._img, 0, 0, dims.width, dims.height);
				res(ImgUtils._ctx.getImageData(0, 0, dims.width, dims.height));
			}
			ImgUtils._img.src = src;
		})
	}

	static asDataUrl(img:ImageData):string {
		ImgUtils.scaleTo(img);
		ImgUtils._ctx.clearRect(0, 0, img.width, img.height);
		ImgUtils._ctx.putImageData(img, 0, 0);
		return ImgUtils._canvas.toDataURL("image/png");
	}
	
	static show(img:ImageData){
		ImgUtils.scaleTo(img);
		ImgUtils._ctx.clearRect(0, 0, img.width, img.height);
		ImgUtils._ctx.putImageData(img, 0, 0);
		document.body.appendChild(ImgUtils._canvas);
	}

	static asImageData(data:Uint8ClampedArray, width:number, height:number) {
		ImgUtils.scaleTo({width, height});
		const img = ImgUtils._ctx.getImageData(0, 0, width, height);
		img.data.set(data);
		return img;
	}
}

ImgUtils._img.crossOrigin = "Anonymous";
