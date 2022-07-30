export default function kernelInput(callback:(arr:number[]) => void) {
	const elm = document.createElement("div");
	const inputs:HTMLInputElement[] = [];

	elm.style.cssText = `display:grid; grid-template-columns:1fr 1fr 1fr`;

	const createArr = () => {
		return inputs.map(input => Number(input.value));
	}

	for(let i = 0; i < 9; i++){
		const inputElm = document.createElement("input");
		inputElm.type = "number";
		elm.appendChild(inputElm);
		inputs.push(inputElm);
		inputElm.addEventListener("change", () => callback(createArr()));
	}

	return elm;
}