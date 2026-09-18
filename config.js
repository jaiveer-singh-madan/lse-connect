// Read once, here, so no component has to know where these come from.

export const FORM_URL = import.meta.env.VITE_FORM_URL || '';
export const API_URL = import.meta.env.VITE_API_URL || '';

// Where the "Early access" buttons point: a Google Form if one is configured,
// otherwise the built-in signup page.
export const SIGNUP_HREF = FORM_URL || '/signup';
export const SIGNUP_IS_EXTERNAL = Boolean(FORM_URL);
