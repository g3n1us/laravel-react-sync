
/**
 Using Traits:
 Traits are a way to apply a similar set of properties to another object. This of it as though, the properties of the trait class are copied and pasted into the class on which they are applied. In order to use this, you must add two things to your parent class.

 1. Add the following to the `constructor` method:

@example
 this.constructor.instance_methods_from_traits.map(method => {
   Object.defineProperty(this, method.key, method.descriptor);
 });



 2. Add the following method:

@example
 static applyTrait(trait){
     this.instance_methods_from_traits = [...(this.instance_methods_from_traits || []), ...(new trait(this))];
 }


 Lastly, call `applyTrait` after your class declaration with your trait class as the functions argument
@interface
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
			return !d.obj.constructor.hasOwnProperty(d.key) && d.key !== 'constructor';
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

		return instance_methods;
	}
}

export default Trait;
