import { Uint8ClampedArrayPointer } from "./pointers";
import { IWasmContextBase } from "./types";
import { CreateWasmContext } from "./wasmContext";

// interface IImgLibExports {
// 	getImageProcessor: (width:number, height:number) => Ptr,
// 	getImageBuffer: (ptr:number) => Ptr,
// 	applyKernel: (ptr:number) => void,
// }

const imgLibExports = {
	getImageProcessor: function (this:IWasmContextBase, width:number, height:number):number {
		return this.instance.exports.getImageProcessor(width, height);
	},

	getImageBuffer: function (this:IWasmContextBase, ptr:number, width:number, height:number) {
		return new Uint8ClampedArrayPointer(this.instance.exports.getImageBuffer(ptr), width * height * 4, this);
	},

	applyKernel: function (this:IWasmContextBase, ptr:number) {
		return this.instance.exports.applyKernel(ptr);
	},
}

const ctxSettings = {
	src:"build/img-lib.wasm", 
	exports: imgLibExports, 
	imports: {},
}

const ctx = await CreateWasmContext(ctxSettings);
export default ctx;