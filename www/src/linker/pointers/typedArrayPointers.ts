import { Pointer, PointerArgs } from "./pointer";

export class Uint8ClampedArrayPointer extends Pointer<Uint8ClampedArray> {
	constructor(...args:PointerArgs) {
		super(...args);
	}
	get value() {
		return new Uint8ClampedArray(this.memory.buffer, this.ptr, this.size)
	}

	set value(v:Uint8ClampedArray) {
		this.value.set(v);
	}
}
export class Int16ArrayPointer extends Pointer<Int16Array> {
	get value() {
		return new Int16Array(this.memory.buffer, this.ptr, this.size)
	}
	set value(v:Int16Array) {
		this.value.set(v);
	}
}

export class I32Pointer extends Pointer<number> {
	constructor(
		ptr:number,
		ctx:WebAssembly.Instance
	){ super(ptr, 4, ctx) };

	get value(): number {
		const dv = new DataView(this.memory.buffer);
		return dv.getInt32(this.ptr);
	}
}


