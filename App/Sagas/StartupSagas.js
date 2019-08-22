import Config from 'react-native-config';

// process STARTUP actions
export function* startup(action) {
	if (__DEV__ && console.tron) {
		// fully customized!
		const subObject = { a: 1, b: [1, 2, 3], c: true };
		subObject.circularDependency = subObject; // osnap!
		console.tron.display({
			name: '🔥 IGNITE 🔥',
			preview: `You are running ENV:${Config.ENV}`,
			value: {
				'💃': 'Welcome to the future!',
				subObject,
				someInlineFunction: () => true,
				someGeneratorFunction: startup
			}
		});
	}
}
