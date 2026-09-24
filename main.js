class Operaciones {
	constructor(valor1, valor2) {
		this.valor1 = valor1;
		this.valor2 = valor2;
	}

	sumar() {
		return this.valor1 + this.valor2;
	}

	restar() {
		return this.valor1 - this.valor2;
	}

	multiplicar() {
		return this.valor1 * this.valor2;
	}

	dividir() {
		if (this.valor2 === 0) {
			throw new Error('No se puede dividir entre cero');
		}

		return this.valor1 / this.valor2;
	}
}

const valor1 = 5;
const valor2 = 7;
const operaciones = new Operaciones(valor1, valor2);

console.log(`La suma es: ${operaciones.sumar()}`);
console.log(`La resta es: ${operaciones.restar()}`);
console.log(`La multiplicacion es: ${operaciones.multiplicar()}`);
console.log(`La division es: ${operaciones.dividir()}`);
