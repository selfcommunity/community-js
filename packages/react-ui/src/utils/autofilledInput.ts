import {useState} from 'react';
import {useIsomorphicLayoutEffect} from '@selfcommunity/react-core';

/**
 * Get previous props value with React Hooks
 * @param id
 *
 * Usage:
 * import {useInitialAutofilledInput} from '@selfcommunity/react-core';
 *
 * const MyComponent = ({ count }) => {
 *    const wasInitiallyAutofilled = useInitialAutofilledInput('credential_username');
 *    <UsernameTextField
 *        id="credential_username"
 *        name="username"
 *        value={username}
 *        InputLabelProps={{shrink: Boolean(wasInitiallyAutofilled && !username)}}
 *        onChange={handleChangeUsername}
 *        label={<FormattedMessage id="pwa.page.accountLogin.username.label" defaultMessage="pwa.page.accountLogin.username.label" />}
 *        fullWidth
 *      />
 * }
 */
const useInitialAutofilledInput = (id, value) => {
  const [wasInitiallyAutofilled, setWasInitiallyAutofilled] = useState(false);
  const [initialized, setAutofilledInitialized] = useState(false);

  useIsomorphicLayoutEffect(() => {
    /**
     * The field can be prefilled on the very first page loading by the browser
     * By the security reason browser limits access to the field value from JS level and the value becomes available
     * only after first user interaction with the page
     * So, even if the Formik thinks that the field is not touched by user and empty,
     * it actually can have some value, so we should process this edge case in the form logic
     */
    const checkAutofilled = () => {
      if (id && document) {
        setWasInitiallyAutofilled(!!document.getElementById(id)?.matches('*:-webkit-autofill'));
      }
    };
    // The time when it's ready is not very stable, so check few times
    setTimeout(checkAutofilled, 500);
    setTimeout(checkAutofilled, 1000);
    setTimeout(checkAutofilled, 2000);
  }, []);

  return {autofilled: wasInitiallyAutofilled && !initialized && !value, setAutofilledInitialized};
};

export default useInitialAutofilledInput;
