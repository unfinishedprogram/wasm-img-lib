export interface IWasmContextBase {
	instance: { exports : Record<string, CallableFunction> };
	memory:WebAssembly.Memory;
	module:WebAssembly.Module;
}

export interface IWasmContextSettings<E> {
	src:string, 
  exports:E, 
  imports:Record<string, Function>
}