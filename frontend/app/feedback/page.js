'use client'
import { useState, useEffect } from 'react';
import { Container, Stack, Group, Center, Title, Text, Paper, Divider } from '@mantine/core';

export default function FeedbackPage() {
    const [feedbackDetails, setFeedbackDetails] = useState([]);

    useEffect(() => {
        // Fetch feedback from backend
        fetch('http://127.0.0.1:5000/feedback')
            .then(response => response.json())
            .then(data => {
                const feedback = data.response;
                const feedbackItems = feedback.split('\n\n').map(item => item.trim());
                setFeedbackDetails(feedbackItems);
            });
    }, []);

    return (
        <Container size="md">
            <Stack spacing="xl">
                <Center><Title order={1}>Feedback</Title></Center>
                <Group position="center" direction="column" spacing="md">
                    <Text align="center">
                        Lets see what we need help on!
                    </Text>
                    {feedbackDetails.map((detail, index) => (
                        <Paper key={index} shadow="xs" p="md" radius="md" withBorder>
                            {detail.split('\n').map((line, lineIndex) => (
                                <Text key={lineIndex}>{line}</Text>
                            ))}
                            {index < feedbackDetails.length - 1 && <Divider my="sm" />}
                        </Paper>
                    ))}
                </Group>
            </Stack>
        </Container>
    );
}
