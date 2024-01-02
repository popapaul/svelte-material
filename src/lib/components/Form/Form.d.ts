import SvelteComponent from '../../shared';

interface FormProps {
	/** classes added to the appbar */
	class?: string;
	/** styles added to the appbar */
	style?: string;

	handleSubmit?: () => void;
	handleErrors?: (inputs: HTMLElement[]) => void;
}

declare class Form extends SvelteComponent<FormProps> {
	validate: () => { success: boolean; inputs: HTMLElement[] };
}

export default Form;
