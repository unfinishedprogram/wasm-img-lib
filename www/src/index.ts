import ctx from "./linker/imgLibWasm";
import ImgUtils from "./imgUtils";

const url = "corn.jpg";

ImgUtils.loadImageDataFromSrc(url, 500, 500).then(img => {
	const [w, h] = [img.width, img.height];
	const ptr = ctx.getImageProcessor(w, h)!;
	const bufferPtr = ctx.getImageBuffer(ptr, w, h);
	
	bufferPtr.value.set(img.data);
	
	const t = performance.now();
	ctx.applyKernel(ptr);
	console.log("DONE:", performance.now()-t);	
	
	const imgData = ImgUtils.asImageData(ctx.getImageBuffer(ptr, w, h).value, w, h);
	ImgUtils.show(imgData)
})