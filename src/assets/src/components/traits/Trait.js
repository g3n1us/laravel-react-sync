
/**
 Using Traits:
 Traits are a way to apply a similar set of properties to another object. This of it as though, the properties of the trait class are copied and pasted into the class on which they are applied.

 Usage:

 ```
//  create a class that extends `Trait`

class ExampleTrait extends Trait{
	constructor(TargetClass){
		super(TargetClass);
	}

	exampleMethod(){
		// this will be applied to TargetClass
	}
}

// in TargetClass file

MyMainClass{
	// ...
}

ExampleTrait.applyTo(MyMainClass);

```
*/


/**
 * Trait
 * @mixin
 */
class Trait{
	constructor(TargetClass){

		const property_map = (v, i, d, a) => {
			let access_method = v[1].get ? 'get' : 'value';
			let is_writable = access_method === 'value' ? {writable: true, configurable: true} : {};
			return {
				descriptor: {[access_method]: v[1][access_method], ...is_writable},
				key: v[0],
				obj: v[2],
			};
		}

		const property_filter = (d) => {
			if(d.key === 'constructor') return false;
			if((d.key in TargetClass.prototype)){
				return false;
			}
			return !d.obj.constructor.hasOwnProperty(d.key);
		}

		const extract_methods = () => {
			return [
				['static_methods', this.constructor],
				['instance_methods', Object.getPrototypeOf(this)]
			].reduce((accumulator, currentThis, ind) => {
				let descriptors = Object.getOwnPropertyDescriptors(currentThis[1]);
				let arr = []; for(let i in descriptors) arr.push([i, descriptors[i], currentThis[1]]);
				accumulator[currentThis[0]] = arr.map(property_map).filter(property_filter);
				return accumulator;
			}, {});
		}

		let {static_methods, instance_methods} = extract_methods();

		static_methods.map(method => {
			Object.defineProperty(TargetClass, method.key, method.descriptor);
		});

		instance_methods.map(method => {
			Object.defineProperty(TargetClass.prototype, method.key, method.descriptor);
		});
	}

	/** */
	static applyTo(Obj){
		new this(Obj);
	}
}

export default Trait;
