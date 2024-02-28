'use client'
import { useState, useEffect } from 'react';
import { Loader, Container, Stack, Group, Center, Title, Text, Paper, Divider } from '@mantine/core';

export default function FeedbackPage() {
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        // Fetch feedback from backend
        fetch('http://127.0.0.1:5000/feedback')
            .then(response => response.json())
            .then(data => {
                setFeedback(data.response);
            });
    }, []);

    return (
        <Center>
        <Container size="md">
            <Stack spacing="xl">
                <Title ta='center' order={1}>Feedback</Title>
                <Text align="center">
                    Lets see what we need help on!
                </Text>
                <Center>
                {feedback.length === 0 ? <Loader ta='center' /> :
                    <Paper shadow="xs" p="md" radius="md" withBorder>
                        {feedback}
                    </Paper>
                }
                </Center>
 
            </Stack>
        </Container>
        </Center>
    );
}
