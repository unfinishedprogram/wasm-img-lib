import { CreateWasmContext } from "./linker/wasmContext";

const imgLibWasmExports = {
	getImageProcessor: (getImageProcessor, ctx) => (width:number, height:number):number => getImageProcessor(width, height),
	getImageBuffer: (getImageBuffer, ctx) => (ptr:number):number => getImageBuffer(ptr),
	applyKernel: (applyKernel, ctx) => (ptr:number):number => applyKernel(ptr),
}

export default class ImgLib {
	private ctx = CreateWasmContext({
		src:"build/img-lib.wasm", 
		exports: imgLibWasmExports, 
		imports: {},
	});
}