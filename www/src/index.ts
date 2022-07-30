import ctx from "./linker/imgLibWasm";
import ImgUtils from "./imgUtils";
import { brighten, identity, sharpen } from "./kernel";
import kernelInput from "./kernelInput";

const url = "corn.jpg";


ImgUtils.loadImageDataFromSrc(url, 500, 500).then(img => {
	const [w, h] = [img.width, img.height];
	const ptr = ctx.getImageProcessor(w, h);
	const bufferPtr = ctx.getImageBuffer(ptr, w, h);
	bufferPtr.value.set(img.data);
	const kernelPtr = ctx.getKernelBuffer(ptr);

	const kernelInputElm = kernelInput(kernel => {
		const t = performance.now();
		ctx.getImageBuffer(ptr, w, h).value.set(img.data)
		kernelPtr.value = new Int16Array(kernel);
		ctx.applyKernel(ptr);
		const imgData = ImgUtils.asImageData(ctx.getImageBuffer(ptr, w, h).value, w, h)
		ImgUtils.show(imgData);
		console.log("DONE:", performance.now()-t); 
	})
	document.body.appendChild(kernelInputElm);
})