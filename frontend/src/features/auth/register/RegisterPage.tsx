import { useNavigate } from '@tanstack/react-router';
import {
    TextInput,
    PasswordInput,
    Button,
    Paper,
    Title,
    Text,
    Stack,
    Blockquote,
    Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { InfoIcon } from 'lucide-react';
import { useRegister } from '@/features/auth/register/useRegister';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import { validators } from '@/features/_common/utils/validators';
import { useErrorHandler } from '@/features/_common/hooks/useErrorHandler';
import type { RegisterRequest } from '@/features/auth/register/types';

interface RegisterFormValues extends RegisterRequest {
    confirmPassword: string;
}

export function RegisterPage() {
    const navigate = useNavigate();
    const registerMutation = useRegister();

    const { errors, handleError, clearErrors } = useErrorHandler({
        overrides: {
            409: 'Acest email este deja înregistrat.',
        },
    });

    const form = useForm<RegisterFormValues>({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            email: validators.email,
            password: validators.password,
            confirmPassword: validators.confirmPassword,
        }
    });

    const handleSubmit = async (values: RegisterFormValues) => {
        clearErrors();

        try {
            await registerMutation.mutateAsync({
                email: values.email,
                password: values.password,
            });

            // Success - redirect to login
            navigate({ to: '/login' });
        } catch (error: any) {
            handleError(error);
        }
    };

    return (
        <Box
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '0 16px',
            }}
        >
            <Paper withBorder shadow="md" p={30} radius="md" style={{ width: '420px', maxWidth: '100%' }}>
                <Title ta="center" style={{ fontWeight: 900 }} size="h2">
                    Înregistrare în sistem
                </Title>

                {/* Hide info block when errors are present to save space */}
                {!errors && (
                    <Blockquote
                        color="blue"
                        icon={<InfoIcon size={16} />}
                        my={20}
                        p="md"
                        fz="sm"
                        ta="left"
                    >
                        Asocierea automată și drepturile de student se activează doar dacă facultatea te-a înscris deja în sistem înainte de a-ți crea contul.
                    </Blockquote>
                )}

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        {errors && (
                            <ErrorAlert
                                errors={errors}
                                mt={20}
                                onClose={clearErrors}
                            />
                        )}

                        <TextInput
                            label="Email"
                            placeholder="exemplu@email.com"
                            required
                            {...form.getInputProps('email')}
                        />

                        <PasswordInput
                            label="Parolă"
                            placeholder="Parola dvs."
                            required
                            description="Minim 8 caractere, o literă mare, o cifră și un caracter special"
                            {...form.getInputProps('password')}
                        />

                        <PasswordInput
                            label="Confirmă parola"
                            placeholder="Confirmă parola"
                            required
                            {...form.getInputProps('confirmPassword')}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            mt="md"
                            loading={registerMutation.isPending}
                        >
                            Înregistrare
                        </Button>

                        <Text ta="center" size="sm">
                            Ai deja un cont?{' '}
                            <Text
                                component="a"
                                href="/login"
                                c="blue"
                                fw={500}
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate({ to: '/login' });
                                }}
                            >
                                Autentifică-te
                            </Text>
                        </Text>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}