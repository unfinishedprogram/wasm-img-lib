// Used to simplify subclass constructors
export type PointerArgs = [
	ptr:number,
	size:number,
	ctx:WebAssembly.Instance,
	dynamic?:boolean,
];

// Must have a pre-allocated size,
// TODO reuse the same array buffer to avoid allocation
export abstract class Pointer<T> {
	protected readonly memory:WebAssembly.Memory;
	private _getPtr = () => this._ptr;
	constructor (
		private readonly _ptr:number,
		public readonly size:number, // In bytes
		protected ctx:WebAssembly.Instance, // Raw wasm instance
		public dynamic = false,
	) {
		this.memory = ctx.exports.memory as WebAssembly.Memory;

		if(this.dynamic) {
			const dv = new DataView(this.memory.buffer);
			this._getPtr = () => {
				console.log(_ptr);
				return dv.getUint32(_ptr);
			};
		}
	};

	public get ptr() {
		return this._getPtr();
	}

	abstract get value():T;
	abstract set value(v:T);
}



