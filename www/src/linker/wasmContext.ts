import { IWasmContextBase, IWasmContextSettings } from "./types";
import log, { LogLevel } from "../log";

const decoder = new TextDecoder();

const DEFAULT_IMPORTS = {
	jslogStr (str_ptr:number, size:number) {
		const buffer = new Uint8Array(this.memory!.buffer, str_ptr, size);
		const string = decoder.decode(buffer);
		log(string, LogLevel.WASM);
	},

	jslogNum (num:number) {
		log(num, LogLevel.WASM);
	}
}

export async function CreateWasmContext <E extends Record<string, Function>> 
    (settings:IWasmContextSettings<E>) : Promise<IWasmContextBase & E> 
{    
    const ctx = {} as IWasmContextBase & E;
    
    for(const key in settings.imports) settings.imports[key] = settings.imports[key].bind(ctx);

    Object.assign(settings.imports, DEFAULT_IMPORTS);

    // Load wasm file and compile with imports
    const wasm = await fetch(settings.src)
        .then(data => data.arrayBuffer())
        .then(buffer => WebAssembly.instantiate(buffer, { env:settings.imports }));

    ctx.instance = wasm.instance as any;
    ctx.memory = wasm.instance.exports.memory as WebAssembly.Memory;
    ctx.module = wasm.module;

    // Handle exports
    const unhandledKeys = new Set(Object.keys(ctx.instance.exports));
    unhandledKeys.delete("memory");
    
    for(const key in settings.exports){
        if(!unhandledKeys.has(key)){
            console.warn(`Warning: ${key} is exported by wasm but not registered`)
        } else {
            ctx[key as keyof E] = settings.exports[key].bind(ctx);
            unhandledKeys.delete(key);
        }
    }

    if(unhandledKeys.size > 0){
        unhandledKeys.forEach(key => 
            console.warn(`Warning: ${key} is registered but not exported by wasm`)
        )
    }

    return ctx;
}