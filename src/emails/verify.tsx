import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

type VerifyEmailProps = {
  code: string;
  email: string;
};

const VerifyEmail = ({ code, email }: VerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Use code {code} as the verification code for {email}.
    </Preview>
    <Tailwind
      config={{
        theme: {
          colors: {
            background: '#ffffff',
            'muted-foreground': '#465347',
            card: '#ffffff',
            'card-foreground': '#020802',
            border: '#e2e9e3',
          },
        },
      }}
    >
      <Body className='mx-auto my-auto px-2 font-sans'>
        <Container className='mx-auto my-10 max-w-md rounded-lg border border-solid border-border bg-card p-6 text-card-foreground'>
          <Heading className='mb-6 mt-0 p-0 text-3xl font-bold tracking-tight'>
            Verify your account
          </Heading>
          <Section>
            <Text className='m-0 mb-2 text-base'>
              Use the following code to verify your account:
            </Text>
            <Text className='m-0 text-2xl font-medium tracking-tight'>
              {code}
            </Text>
            <Text className='m-0 text-sm text-muted-foreground'>
              This code will be valid for 15 minutes.
            </Text>
          </Section>
          <Hr className='mx-0 my-6 w-full border-border' />
          <Section>
            <Text className='m-0 text-xs text-muted-foreground'>
              This verification code was intended for{' '}
              <span className='text-card-foreground'>{email}</span>.
            </Text>
            <Text className='m-0 text-xs text-muted-foreground'>
              If you were not expecting this email, you can just ignore it and
              move on with your day.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

VerifyEmail.PreviewProps = {
  code: '123456',
  email: 'someone@example.com',
} satisfies VerifyEmailProps;

export default VerifyEmail;
