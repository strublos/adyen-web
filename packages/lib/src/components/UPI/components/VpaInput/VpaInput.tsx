import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { useCallback, useEffect, useImperativeHandle } from 'preact/hooks';
import useCoreContext from '../../../../core/Context/useCoreContext';
import Field from '../../../internal/FormFields/Field';
import useForm from '../../../../utils/useForm';
import renderFormField from '../../../internal/FormFields';
import { vpaValidationRules } from './validate';
import './VpaInput.scss';

interface VpaInputProps {
    data?: {};
    onChange({ data: VpaInputDataState, valid, errors, isValid: boolean }): void;
}

interface VpaInputDataState {
    virtualPaymentAddress?: string;
}

export type VpaInputHandlers = {
    validateInput(): void;
};

const VpaInput = forwardRef<VpaInputHandlers, VpaInputProps>((props, ref) => {
    const { i18n } = useCoreContext();
    const formSchema = ['virtualPaymentAddress'];
    const { handleChangeFor, triggerValidation, data, valid, errors, isValid } = useForm<VpaInputDataState>({
        schema: formSchema,
        defaultData: props.data,
        rules: vpaValidationRules
        // formatters: pixFormatters
    });

    const validateInput = useCallback(() => {
        triggerValidation();
    }, [triggerValidation]);

    useImperativeHandle(ref, () => ({
        validateInput
    }));

    useEffect(() => {
        props.onChange({ data, valid, errors, isValid });
    }, [data, valid, errors]);

    return (
        <Field label={i18n.get('virtualPaymentAddress')} errorMessage={!!errors.virtualPaymentAddress} classNameModifiers={['vpa']}>
            {renderFormField('text', {
                name: 'virtualPaymentAddress',
                autocorrect: 'off',
                spellcheck: false,
                value: data.virtualPaymentAddress,
                onInput: handleChangeFor('virtualPaymentAddress', 'input'),
                onBlur: handleChangeFor('virtualPaymentAddress', 'blur')
            })}
        </Field>
    );
});

export default VpaInput;
