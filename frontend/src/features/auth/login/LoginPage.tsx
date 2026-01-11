import { useNavigate } from '@tanstack/react-router';
import {
    TextInput,
    PasswordInput,
    Button,
    Paper,
    Title,
    Text,
    Container,
    Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLogin } from '@/features/auth/login/useLogin';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import { validators } from '@/features/_common/utils/validators';
import { useErrorHandler } from '@/features/_common/hooks/useErrorHandler';
import type { LoginRequest } from './types';

export function LoginPage() {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const { errors, handleError, clearErrors } = useErrorHandler({
        overrides: { // TODO: Handle locked account
            401: 'Email sau parolă incorectă.',
        },
    });

    const form = useForm<LoginRequest>({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: validators.email,
            password: (value) => validators.required(value, 'Parola este obligatorie'),
        },
    });

    const handleSubmit = async (values: LoginRequest) => {
        clearErrors();

        try {
            await loginMutation.mutateAsync({
                email: values.email,
                password: values.password,
            });

            navigate({ to: '/' });
        } catch (error: any) {
            handleError(error);
        }
    };

    return (
        <Container size={420} my={40}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title ta="center" style={{ fontWeight: 900 }} mb={20} size="h2">
                    Bine ai revenit!
                </Title>

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
                            {...form.getInputProps('password')}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            mt="md"
                            loading={loginMutation.isPending}
                        >
                            Autentificare
                        </Button>

                        <Text ta="center" size="sm">
                            Nu ai un cont?{' '}
                            <Text
                                component="a"
                                href="/register"
                                c="blue"
                                fw={500}
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate({ to: '/register' });
                                }}
                            >
                                Înregistrează-te
                            </Text>
                        </Text>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
