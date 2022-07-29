import { IWasmContextBase } from "./types"

export class Uint8ClampedArrayPointer {
	constructor(public ptr:number, public size:number, private ctx:IWasmContextBase){}
	
	get value():Uint8ClampedArray {
		return new Uint8ClampedArray(this.ctx.memory.buffer, this.ptr, this.size)
	}
}
