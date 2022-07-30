import { Int16ArrayPointer, Uint8ClampedArrayPointer } from "./pointers/typedArrayPointers";
import { IWasmContextBase } from "./types";
import { CreateWasmContext } from "./wasmContext";

const imgLibExports = {
	getImageProcessor: function (this:IWasmContextBase, width:number, height:number):number {
		return this.instance.exports.getImageProcessor(width, height);
	},

	getImageBuffer: function (this:IWasmContextBase, ptr:number, width:number, height:number) {
		return new Uint8ClampedArrayPointer(this.instance.exports.getImageBuffer(ptr), width * height * 4, this.instance);
	},

	applyKernel: function (this:IWasmContextBase, ptr:number) {
		return this.instance.exports.applyKernel(ptr);
	},

	getKernelBuffer:function(this:IWasmContextBase, ptr:number) {
		return new Int16ArrayPointer(this.instance.exports.getKernelBuffer(ptr), 9 * 2, this.instance);
	}
}

const ctxSettings = {
	src:"build/img-lib.wasm", 
	exports: imgLibExports, 
	imports: {},
}

const ctx = await CreateWasmContext(ctxSettings);
export default ctx;